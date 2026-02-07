import type { Value } from 'platejs';

import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
} from '@platejs/basic-nodes/react';
import {
  Plate,
  usePlateEditor,
} from 'platejs/react';

import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ToolbarSeparator } from '@/components/ui/toolbar';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
} from 'lucide-react';
import { useEffect, useRef } from 'react';

export interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

// Helper to convert HTML to Plate.js Value format
function htmlToPlateValue(html: string): Value {
  if (!html || html.trim() === '') {
    return [{ type: 'p', children: [{ text: '' }] }];
  }
  
  // Check if input is plain text (no HTML tags)
  const isPlainText = !/<[^>]+>/.test(html);
  
  if (isPlainText) {
    // For plain text, wrap in a paragraph with left alignment
    return [{ type: 'p', align: 'left', children: [{ text: html }] }];
  }
  
  // Basic HTML parsing - for more complex HTML, you might need a proper parser
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  const nodes: Value = [];
  
  const parseNode = (element: Node): any[] => {
    const children: any[] = [];
    
    element.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text) {
          children.push({ text });
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tagName = el.tagName.toLowerCase();
        
        if (tagName === 'p') {
          const innerChildren = parseNode(el);
          const style = el.getAttribute('style') || '';
          let align = 'left';
          if (style.includes('text-align: center')) align = 'center';
          else if (style.includes('text-align: right')) align = 'right';
          else if (style.includes('text-align: justify')) align = 'justify';
          
          nodes.push({
            type: 'p',
            align,
            children: innerChildren.length > 0 ? innerChildren : [{ text: '' }],
          });
        } else if (tagName === 'ul') {
          const innerChildren = parseNode(el);
          nodes.push({
            type: 'ul',
            children: innerChildren.length > 0 ? innerChildren : [{ text: '' }],
          });
        } else if (tagName === 'ol') {
          const innerChildren = parseNode(el);
          nodes.push({
            type: 'ol',
            children: innerChildren.length > 0 ? innerChildren : [{ text: '' }],
          });
        } else if (tagName === 'li') {
          const innerChildren = parseNode(el);
          nodes.push({
            type: 'li',
            children: innerChildren.length > 0 ? innerChildren : [{ text: '' }],
          });
        } else if (tagName === 'strong' || tagName === 'b') {
          const text = el.textContent || '';
          children.push({ text, bold: true });
        } else if (tagName === 'em' || tagName === 'i') {
          const text = el.textContent || '';
          children.push({ text, italic: true });
        } else if (tagName === 'u') {
          const text = el.textContent || '';
          children.push({ text, underline: true });
        } else if (tagName === 's' || tagName === 'strike') {
          const text = el.textContent || '';
          children.push({ text, strikethrough: true });
        } else if (tagName === 'code') {
          const text = el.textContent || '';
          children.push({ text, code: true });
        } else {
          children.push(...parseNode(el));
        }
      }
    });
    
    return children;
  };
  
  parseNode(tempDiv);
  
  return nodes.length > 0 ? nodes : [{ type: 'p', align: 'left', children: [{ text: '' }] }];
}

// Helper to convert Plate.js Value to HTML
function plateValueToHtml(value: Value): string {
  const serializeNode = (node: any): string => {
    if (node.text !== undefined) {
      let text = node.text;
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;
      if (node.code) text = `<code>${text}</code>`;
      return text;
    }
    
    if (node.type === 'p') {
      const children = node.children?.map(serializeNode).join('') || '';
      const align = node.align || 'left';
      const style = align !== 'left' ? ` style="text-align: ${align}"` : '';
      return `<p${style}>${children}</p>`;
    }
    
    if (node.type === 'ul') {
      const children = node.children?.map(serializeNode).join('') || '';
      return `<ul>${children}</ul>`;
    }
    
    if (node.type === 'ol') {
      const children = node.children?.map(serializeNode).join('') || '';
      return `<ol>${children}</ol>`;
    }
    
    if (node.type === 'li') {
      const children = node.children?.map(serializeNode).join('') || '';
      return `<li>${children}</li>`;
    }
    
    return '';
  };
  
  return value.map(serializeNode).join('');
}

export function RichTextEditor({ 
  value = '',
  onChange,
  placeholder = 'Type your content here...',
  className,
}: RichTextEditorProps) {
  const isInternalChange = useRef(false);
  
  const editor = usePlateEditor({
    plugins: [BoldPlugin, ItalicPlugin, UnderlinePlugin, StrikethroughPlugin, CodePlugin],
    value: htmlToPlateValue(value),
  });

  // Sync external value changes to editor
  useEffect(() => {
    if (editor && value !== undefined) {
      const currentHtml = plateValueToHtml(editor.children as Value);
      
      if (currentHtml !== value) {
        isInternalChange.current = true;
        const newPlateValue = htmlToPlateValue(value);
        editor.children = newPlateValue;
        requestAnimationFrame(() => {
          isInternalChange.current = false;
        });
      }
    }
  }, [value, editor]);

  const handleChange = (ctx: { value: Value; editor: any }) => {
    if (onChange && !isInternalChange.current) {
      const html = plateValueToHtml(ctx.value);
      onChange(html);
    }
  };

  return (
    <TooltipProvider>
      <Plate editor={editor} onChange={handleChange}>
        <div className={className}>
          <FixedToolbar className="justify-start rounded-t-lg border border-input bg-background">
            {/* Text Formatting */}
            <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">
              <strong className="text-sm font-bold">B</strong>
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">
              <em className="text-sm font-serif">I</em>
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">
              <span className="text-sm underline">U</span>
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
              <span className="text-sm line-through">S</span>
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="code" tooltip="Code">
              <code className="text-xs font-mono bg-muted px-1 py-0.5 rounded">{`</>`}</code>
            </MarkToolbarButton>
            
            <ToolbarSeparator />
            
            {/* Alignment - Using placeholder buttons for now */}
            <MarkToolbarButton nodeType="align-left" tooltip="Align Left">
              <AlignLeft className="h-4 w-4" />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="align-center" tooltip="Align Center">
              <AlignCenter className="h-4 w-4" />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="align-right" tooltip="Align Right">
              <AlignRight className="h-4 w-4" />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="align-justify" tooltip="Justify">
              <AlignJustify className="h-4 w-4" />
            </MarkToolbarButton>
            
            <ToolbarSeparator />
            
            {/* Lists - Using placeholder buttons for now */}
            <MarkToolbarButton nodeType="bullet-list" tooltip="Bullet List">
              <List className="h-4 w-4" />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="numbered-list" tooltip="Numbered List">
              <ListOrdered className="h-4 w-4" />
            </MarkToolbarButton>
          </FixedToolbar>
          <EditorContainer className="border border-t-0 border-input rounded-b-lg min-h-[200px]">
            <Editor placeholder={placeholder} className="p-3 text-left" />
          </EditorContainer>
        </div>
      </Plate>
    </TooltipProvider>
  );
}
