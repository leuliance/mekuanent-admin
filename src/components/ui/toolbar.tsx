import * as React from 'react';

import { Toolbar as ToolbarPrimitive } from '@base-ui/react/toolbar';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import {
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export function Toolbar({
  className,
  ...props
}: ToolbarPrimitive.Root.Props & { className?: string }) {
  return (
    <ToolbarPrimitive.Root
      className={cn('relative flex select-none items-center', className)}
      {...props}
    />
  );
}

export function ToolbarToggleGroup({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { className?: string }) {
  return (
    <div
      className={cn('flex items-center', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ToolbarLink({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'a'> & { className?: string }) {
  return (
    <a
      className={cn('font-medium underline underline-offset-4', className)}
      {...props}
    />
  );
}

export function ToolbarSeparator({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { className?: string }) {
  return (
    <div
      className={cn('mx-2 my-1 w-px shrink-0 bg-border', className)}
      {...props}
    />
  );
}

// From toggleVariants
const toolbarButtonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-[color,box-shadow] hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[pressed]:bg-accent data-[pressed]:text-accent-foreground aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-9 min-w-9 px-2',
        lg: 'h-10 min-w-10 px-2.5',
        sm: 'h-8 min-w-8 px-1.5',
      },
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
    },
  }
);

const dropdownArrowVariants = cva(
  cn(
    'inline-flex items-center justify-center rounded-r-md font-medium text-foreground text-sm transition-colors disabled:pointer-events-none disabled:opacity-50'
  ),
  {
    defaultVariants: {
      size: 'sm',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'h-9 w-6',
        lg: 'h-10 w-8',
        sm: 'h-8 w-4',
      },
      variant: {
        default:
          'bg-transparent hover:bg-muted hover:text-muted-foreground data-[pressed]:bg-accent data-[pressed]:text-accent-foreground',
        outline:
          'border border-input border-l-0 bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
    },
  }
);

type ToolbarButtonProps = {
  isDropdown?: boolean;
  pressed?: boolean;
} & Omit<ToolbarPrimitive.Button.Props, 'value'> &
  VariantProps<typeof toolbarButtonVariants> & {
    className?: string;
  };

export const ToolbarButton = withTooltip(function ToolbarButton({
  children,
  className,
  isDropdown,
  pressed,
  size = 'sm',
  variant,
  ...props
}: ToolbarButtonProps) {
  const buttonContent = isDropdown ? (
    <>
      <div className="flex flex-1 items-center gap-2 whitespace-nowrap">
        {children}
      </div>
      <div>
        <ChevronDown
          className="size-3.5 text-muted-foreground"
          data-icon
        />
      </div>
    </>
  ) : (
    children
  );

  return (
    <ToolbarPrimitive.Button
      className={cn(
        toolbarButtonVariants({
          size,
          variant,
        }),
        isDropdown && (typeof pressed === 'boolean' ? 'justify-between gap-1 pr-1' : 'pr-1'),
        className
      )}
      data-pressed={pressed}
      {...props}
    >
      {buttonContent}
    </ToolbarPrimitive.Button>
  );
});

export function ToolbarSplitButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof ToolbarButton>) {
  return (
    <ToolbarButton
      className={cn('group flex gap-0 px-0 hover:bg-transparent', className)}
      {...props}
    />
  );
}

type ToolbarSplitButtonPrimaryProps =
  React.ComponentPropsWithoutRef<'span'> &
    VariantProps<typeof toolbarButtonVariants> & {
      className?: string;
    };

export function ToolbarSplitButtonPrimary({
  children,
  className,
  size = 'sm',
  variant,
  ...props
}: ToolbarSplitButtonPrimaryProps) {
  return (
    <span
      className={cn(
        toolbarButtonVariants({
          size,
          variant,
        }),
        'rounded-r-none',
        'group-data-pressed:bg-accent group-data-pressed:text-accent-foreground',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function ToolbarSplitButtonSecondary({
  className,
  size,
  variant,
  ...props
}: React.ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof dropdownArrowVariants>) {
  return (
    <span
      className={cn(
        dropdownArrowVariants({
          size,
          variant,
        }),
        'group-data-pressed:bg-accent group-data-pressed:text-accent-foreground',
        className
      )}
      onClick={(e) => e.stopPropagation()}
      role="button"
      {...props}
    >
      <ChevronDown className="size-3.5 text-muted-foreground" data-icon />
    </span>
  );
}

export function ToolbarToggleItem({
  className,
  size = 'sm',
  variant,
  ...props
}: ToolbarPrimitive.Button.Props &
  VariantProps<typeof toolbarButtonVariants> & {
    className?: string;
  }) {
  return (
    <ToolbarPrimitive.Button
      className={cn(toolbarButtonVariants({ size, variant }), className)}
      {...props}
    />
  );
}

export function ToolbarGroup({
  children,
  className,
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/toolbar-group',
        'relative hidden has-[button]:flex',
        className
      )}
    >
      <div className="flex items-center">{children}</div>

      <div className="group-last/toolbar-group:hidden! mx-1.5 py-0.5">
        <Separator orientation="vertical" />
      </div>
    </div>
  );
}

type TooltipProps<T extends React.ElementType> = {
  tooltip?: React.ReactNode;
  tooltipContentProps?: Omit<
    TooltipPrimitive.Popup.Props,
    'children'
  >;
  tooltipProps?: Omit<TooltipPrimitive.Root.Props, 'children'>;
  tooltipTriggerProps?: TooltipPrimitive.Trigger.Props;
} & React.ComponentProps<T>;

function withTooltip<T extends React.ElementType>(Component: T) {
  return function ExtendComponent({
    tooltip,
    tooltipContentProps,
    tooltipProps,
    tooltipTriggerProps,
    ...props
  }: TooltipProps<T>) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const component = <Component {...(props as React.ComponentProps<T>)} />;

    if (tooltip && mounted) {
      return (
        <TooltipPrimitive.Root {...tooltipProps}>
          <TooltipPrimitive.Trigger render={component} {...tooltipTriggerProps} />
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner sideOffset={4}>
              <TooltipPrimitive.Popup
                className={cn(
                  'z-50 w-fit origin-(--transform-origin) text-balance rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs',
                  tooltipContentProps?.className
                )}
                {...tooltipContentProps}
              >
                {tooltip}
                <TooltipPrimitive.Arrow className="data-[side=bottom]:top-[-4px] data-[side=left]:right-[-4px] data-[side=right]:left-[-4px] data-[side=top]:bottom-[-4px]" />
              </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
          </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
      );
    }

    return component;
  };
}

export function ToolbarMenuGroup({
  children,
  className,
  label,
  ...props
}: React.ComponentProps<typeof DropdownMenuRadioGroup> & { label?: string }) {
  return (
    <>
      <DropdownMenuSeparator
        className={cn(
          'hidden',
          'mb-0 shrink-0 peer-has-[[role=menuitem]]/menu-group:block peer-has-[[role=menuitemradio]]/menu-group:block peer-has-[[role=option]]/menu-group:block'
        )}
      />

      <DropdownMenuRadioGroup
        {...props}
        className={cn(
          'hidden',
          'peer/menu-group group/menu-group my-1.5 has-[[role=menuitem]]:block has-[[role=menuitemradio]]:block has-[[role=option]]:block',
          className
        )}
      >
        {label && (
          <DropdownMenuLabel className="select-none font-semibold text-muted-foreground text-xs">
            {label}
          </DropdownMenuLabel>
        )}
        {children}
      </DropdownMenuRadioGroup>
    </>
  );
}
