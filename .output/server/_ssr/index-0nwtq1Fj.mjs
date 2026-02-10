import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useForm } from "../_chunks/_libs/@tanstack/react-form.mjs";
import { as as Route, az as getBibleBooks, aA as updateBibleVerse, aB as deleteBibleFootnote, aC as deleteBibleCrossReference, aD as deleteBibleVerse, at as createBibleVerse, au as createBibleFootnote, aw as updateBibleFootnote, av as createBibleCrossReference, ax as getBibleFootnotes, ay as getBibleCrossReferences } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { T as Textarea } from "./textarea-CK6DvV64.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { ag as ArrowLeft, B as BookOpen, H as Plus, af as Search, X, L as LoaderCircle, z as Save, a0 as ChevronUp, $ as ChevronDown, ax as Pen, N as Trash2, ab as MessageSquare, ay as Link2, _ as ChevronLeft, g as ChevronRight, F as FileText } from "../_libs/lucide-react.mjs";
import { o as object, s as string, n as number } from "../_libs/zod.mjs";
import "../_libs/tiny-warning.mjs";
import "../_chunks/_libs/@tanstack/router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_chunks/_libs/@tanstack/history.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_chunks/_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_chunks/_libs/@tanstack/form-core.mjs";
import "../_chunks/_libs/@tanstack/store.mjs";
import "../_chunks/_libs/@tanstack/pacer-lite.mjs";
import "../_chunks/_libs/@tanstack/devtools-event-client.mjs";
import "../_chunks/_libs/@tanstack/react-store.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_chunks/_libs/@tanstack/react-router-ssr-query.mjs";
import "../_chunks/_libs/@tanstack/react-query.mjs";
import "../_chunks/_libs/@tanstack/query-core.mjs";
import "../_chunks/_libs/@tanstack/router-ssr-query-core.mjs";
import "./index.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:http";
import "node:https";
import "node:http2";
import "../_libs/sonner.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_chunks/_libs/@base-ui/react.mjs";
import "../_chunks/_libs/@base-ui/utils.mjs";
import "../_libs/reselect.mjs";
import "../_chunks/_libs/@floating-ui/utils.mjs";
import "../_chunks/_libs/@floating-ui/react-dom.mjs";
import "../_chunks/_libs/@floating-ui/dom.mjs";
import "../_chunks/_libs/@floating-ui/core.mjs";
import "../_libs/tabbable.mjs";
const createVerseSchema = object({
  verse_number: number().min(1, "Verse number is required"),
  text_en: string().min(1, "English text is required"),
  text_am: string()
});
const createFootnoteSchema = object({
  marker_en: string().min(1, "Marker is required"),
  marker_am: string(),
  note_en: string().min(1, "Note text is required"),
  note_am: string()
});
const createCrossRefSchema = object({
  reference_book_id: string().min(1, "Book is required"),
  reference_chapter: number().min(1, "Chapter is required"),
  reference_verse_start: number().min(1, "Start verse is required"),
  reference_verse_end: number()
});
function VersesEmptyState({
  bookName,
  chapterNumber,
  searchTerm,
  onClearSearch,
  onAddVerse
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: "No Verses Found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: searchTerm ? `No verses match "${searchTerm}" in ${bookName} Chapter ${chapterNumber}.` : `${bookName} Chapter ${chapterNumber} doesn't have any verses yet.` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-center", children: [
      searchTerm && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClearSearch, children: "Clear Search" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onAddVerse, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
        "Add Verse"
      ] })
    ] })
  ] }) });
}
function ChapterDetailPage() {
  const {
    chapter,
    verses,
    total,
    page,
    totalPages
  } = Route.useLoaderData();
  const {
    bookId,
    chapterId
  } = Route.useParams();
  const {
    search
  } = Route.useSearch();
  const navigate = useNavigate({
    from: Route.fullPath
  });
  const router = useRouter();
  const [searchInput, setSearchInput] = reactExports.useState(search || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [verseToDelete, setVerseToDelete] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [editingVerse, setEditingVerse] = reactExports.useState(null);
  const [editTextEn, setEditTextEn] = reactExports.useState("");
  const [editTextAm, setEditTextAm] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [createVerseDialogOpen, setCreateVerseDialogOpen] = reactExports.useState(false);
  const [isCreatingVerse, setIsCreatingVerse] = reactExports.useState(false);
  const [expandedVerse, setExpandedVerse] = reactExports.useState(null);
  const [footnotes, setFootnotes] = reactExports.useState({});
  const [crossRefs, setCrossRefs] = reactExports.useState({});
  const [loadingFootnotes, setLoadingFootnotes] = reactExports.useState(null);
  const [addFootnoteDialogOpen, setAddFootnoteDialogOpen] = reactExports.useState(false);
  const [addCrossRefDialogOpen, setAddCrossRefDialogOpen] = reactExports.useState(false);
  const [selectedVerseForAdd, setSelectedVerseForAdd] = reactExports.useState(null);
  const [isCreatingFootnote, setIsCreatingFootnote] = reactExports.useState(false);
  const [isCreatingCrossRef, setIsCreatingCrossRef] = reactExports.useState(false);
  const [allBooks, setAllBooks] = reactExports.useState([]);
  const [editFootnoteDialogOpen, setEditFootnoteDialogOpen] = reactExports.useState(false);
  const [editingFootnote, setEditingFootnote] = reactExports.useState(null);
  const [editingFootnoteVerseId, setEditingFootnoteVerseId] = reactExports.useState(null);
  const [isUpdatingFootnote, setIsUpdatingFootnote] = reactExports.useState(false);
  const typedChapter = chapter;
  const typedVerses = verses;
  const book = typedChapter.bible_books;
  reactExports.useEffect(() => {
    const fetchBooks = async () => {
      try {
        const result = await getBibleBooks({
          data: {
            page: 1,
            limit: 100
          }
        });
        setAllBooks(result.books);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };
    fetchBooks();
  }, []);
  const createVerseForm = useForm({
    defaultValues: {
      verse_number: (typedVerses.length || 0) + 1,
      text_en: "",
      text_am: ""
    },
    validators: {
      onChange: createVerseSchema
    },
    onSubmit: async ({
      value
    }) => {
      setIsCreatingVerse(true);
      try {
        await createBibleVerse({
          data: {
            chapter_id: chapterId,
            verse_number: value.verse_number,
            text: {
              en: value.text_en,
              am: value.text_am || void 0
            }
          }
        });
        setCreateVerseDialogOpen(false);
        createVerseForm.reset();
        router.invalidate();
      } catch (error) {
        console.error("Failed to create verse:", error);
      } finally {
        setIsCreatingVerse(false);
      }
    }
  });
  const createFootnoteForm = useForm({
    defaultValues: {
      marker_en: "",
      marker_am: "",
      note_en: "",
      note_am: ""
    },
    validators: {
      onChange: createFootnoteSchema
    },
    onSubmit: async ({
      value
    }) => {
      if (!selectedVerseForAdd) return;
      setIsCreatingFootnote(true);
      try {
        await createBibleFootnote({
          data: {
            verse_id: selectedVerseForAdd.id,
            marker: {
              en: value.marker_en,
              am: value.marker_am || void 0
            },
            note: {
              en: value.note_en,
              am: value.note_am || void 0
            }
          }
        });
        setAddFootnoteDialogOpen(false);
        createFootnoteForm.reset();
        await loadFootnotesForVerse(selectedVerseForAdd.id);
      } catch (error) {
        console.error("Failed to create footnote:", error);
      } finally {
        setIsCreatingFootnote(false);
      }
    }
  });
  const createCrossRefForm = useForm({
    defaultValues: {
      reference_book_id: "",
      reference_chapter: 1,
      reference_verse_start: 1,
      reference_verse_end: 0
    },
    validators: {
      onChange: createCrossRefSchema
    },
    onSubmit: async ({
      value
    }) => {
      if (!selectedVerseForAdd) return;
      setIsCreatingCrossRef(true);
      try {
        const refBook = allBooks.find((b) => b.id === value.reference_book_id);
        const refBookName = refBook ? getLocalizedName(refBook.name) : "Unknown";
        const verseRange = value.reference_verse_end && value.reference_verse_end > 0 ? `${value.reference_verse_start}-${value.reference_verse_end}` : String(value.reference_verse_start);
        await createBibleCrossReference({
          data: {
            verse_id: selectedVerseForAdd.id,
            reference: {
              en: `${refBookName} ${value.reference_chapter}:${verseRange}`
            },
            reference_book_id: value.reference_book_id,
            reference_chapter: value.reference_chapter,
            reference_verse_start: value.reference_verse_start,
            reference_verse_end: value.reference_verse_end && value.reference_verse_end > 0 ? value.reference_verse_end : void 0
          }
        });
        setAddCrossRefDialogOpen(false);
        createCrossRefForm.reset();
        await loadCrossRefsForVerse(selectedVerseForAdd.id);
      } catch (error) {
        console.error("Failed to create cross reference:", error);
      } finally {
        setIsCreatingCrossRef(false);
      }
    }
  });
  const editFootnoteForm = useForm({
    defaultValues: {
      marker_en: "",
      marker_am: "",
      note_en: "",
      note_am: ""
    },
    validators: {
      onChange: createFootnoteSchema
    },
    onSubmit: async ({
      value
    }) => {
      if (!editingFootnote || !editingFootnoteVerseId) return;
      setIsUpdatingFootnote(true);
      try {
        await updateBibleFootnote({
          data: {
            id: editingFootnote.id,
            marker: {
              en: value.marker_en,
              am: value.marker_am || void 0
            },
            note: {
              en: value.note_en,
              am: value.note_am || void 0
            }
          }
        });
        setEditFootnoteDialogOpen(false);
        setEditingFootnote(null);
        await loadFootnotesForVerse(editingFootnoteVerseId);
        setEditingFootnoteVerseId(null);
      } catch (error) {
        console.error("Failed to update footnote:", error);
      } finally {
        setIsUpdatingFootnote(false);
      }
    }
  });
  const handleEditFootnote = (footnote, verseId) => {
    setEditingFootnote(footnote);
    setEditingFootnoteVerseId(verseId);
    editFootnoteForm.setFieldValue("marker_en", getLocalizedText(footnote.marker, "en"));
    editFootnoteForm.setFieldValue("marker_am", getLocalizedText(footnote.marker, "am"));
    editFootnoteForm.setFieldValue("note_en", getLocalizedText(footnote.note, "en"));
    editFootnoteForm.setFieldValue("note_am", getLocalizedText(footnote.note, "am"));
    setEditFootnoteDialogOpen(true);
  };
  const loadFootnotesForVerse = async (verseId) => {
    setLoadingFootnotes(verseId);
    try {
      const [footnotesResult, crossRefsResult] = await Promise.all([getBibleFootnotes({
        data: {
          verseId
        }
      }), getBibleCrossReferences({
        data: {
          verseId
        }
      })]);
      setFootnotes((prev) => ({
        ...prev,
        [verseId]: footnotesResult
      }));
      setCrossRefs((prev) => ({
        ...prev,
        [verseId]: crossRefsResult
      }));
    } catch (error) {
      console.error("Failed to load footnotes:", error);
    } finally {
      setLoadingFootnotes(null);
    }
  };
  const loadCrossRefsForVerse = async (verseId) => {
    try {
      const result = await getBibleCrossReferences({
        data: {
          verseId
        }
      });
      setCrossRefs((prev) => ({
        ...prev,
        [verseId]: result
      }));
    } catch (error) {
      console.error("Failed to load cross refs:", error);
    }
  };
  const handleToggleExpand = async (verseId) => {
    if (expandedVerse === verseId) {
      setExpandedVerse(null);
    } else {
      setExpandedVerse(verseId);
      if (!footnotes[verseId]) {
        await loadFootnotesForVerse(verseId);
      }
    }
  };
  const handleDeleteFootnote = async (footnoteId, verseId) => {
    try {
      await deleteBibleFootnote({
        data: {
          id: footnoteId
        }
      });
      await loadFootnotesForVerse(verseId);
    } catch (error) {
      console.error("Failed to delete footnote:", error);
    }
  };
  const handleDeleteCrossRef = async (crossRefId, verseId) => {
    try {
      await deleteBibleCrossReference({
        data: {
          id: crossRefId
        }
      });
      await loadCrossRefsForVerse(verseId);
    } catch (error) {
      console.error("Failed to delete cross reference:", error);
    }
  };
  const getLocalizedName = (name) => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name;
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };
  const getLocalizedText = (text, lang) => {
    if (typeof text === "object" && text !== null) {
      const textObj = text;
      return textObj[lang] || "";
    }
    return String(text || "");
  };
  const bookName = getLocalizedName(book.name);
  const testamentText = getLocalizedName(book.testament);
  const isOldTestament = testamentText.toLowerCase().includes("old");
  const handleSearch = () => {
    navigate({
      search: {
        page: 1,
        search: searchInput
      }
    });
  };
  const handlePageChange = (newPage) => {
    navigate({
      search: {
        page: newPage,
        search
      }
    });
  };
  const handleDelete = async () => {
    if (!verseToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBibleVerse({
        data: {
          id: verseToDelete.id
        }
      });
      setDeleteDialogOpen(false);
      setVerseToDelete(null);
      navigate({
        to: "/dashboard/bible/$bookId/$chapterId",
        params: {
          bookId,
          chapterId
        },
        search: {
          page,
          search
        }
      });
    } catch (error) {
      console.error("Failed to delete verse:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleEditStart = (verse) => {
    setEditingVerse(verse);
    setEditTextEn(getLocalizedText(verse.text, "en"));
    setEditTextAm(getLocalizedText(verse.text, "am"));
  };
  const handleEditCancel = () => {
    setEditingVerse(null);
    setEditTextEn("");
    setEditTextAm("");
  };
  const handleEditSave = async () => {
    if (!editingVerse) return;
    setIsSaving(true);
    try {
      await updateBibleVerse({
        data: {
          id: editingVerse.id,
          text: {
            en: editTextEn,
            am: editTextAm || void 0
          }
        }
      });
      setEditingVerse(null);
      navigate({
        to: "/dashboard/bible/$bookId/$chapterId",
        params: {
          bookId,
          chapterId
        },
        search: {
          page,
          search
        }
      });
    } catch (error) {
      console.error("Failed to update verse:", error);
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "mb-4", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/bible/$bookId", params: {
        bookId
      }, search: {
        page: 1
      } }), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/bible/$bookId", params: {
        bookId
      }, search: {
        page: 1
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Back to ",
        bookName
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-full ${isOldTestament ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold", children: [
              bookName,
              " Chapter ",
              typedChapter.chapter_number
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
              testamentText,
              " • ",
              typedChapter.verse_count,
              " verses"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateVerseDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
          "Add Verse"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-6 max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search verses...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "pl-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: handleSearch, children: "Search" })
      ] }),
      typedVerses.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(VersesEmptyState, { bookName, chapterNumber: typedChapter.chapter_number, searchTerm: search, onClearSearch: () => navigate({
        search: {
          page: 1,
          search: ""
        }
      }), onAddVerse: () => setCreateVerseDialogOpen(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 mb-6", children: typedVerses.map((verse) => {
          const isEditing = editingVerse?.id === verse.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `bg-card rounded-lg border p-4 transition-all ${isEditing ? "ring-2 ring-primary" : "hover:shadow-sm"}`, children: isEditing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold text-lg shrink-0 w-8", children: verse.verse_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "text-en", className: "text-xs text-muted-foreground", children: "English" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "text-en", value: editTextEn, onChange: (e) => setEditTextEn(e.target.value), className: "mt-1", rows: 3 })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "text-am", className: "text-xs text-muted-foreground", children: "Amharic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "text-am", value: editTextAm, onChange: (e) => setEditTextAm(e.target.value), className: "mt-1", rows: 3 })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleEditCancel, disabled: isSaving, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
                "Cancel"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: handleEditSave, disabled: isSaving, children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-1 animate-spin" }),
                "Saving..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-1" }),
                "Save"
              ] }) })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-bold text-lg shrink-0 w-8", children: verse.verse_number }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-relaxed", children: getLocalizedText(verse.text, "en") }),
                getLocalizedText(verse.text, "am") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: getLocalizedText(verse.text, "am") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => handleToggleExpand(verse.id), title: "Footnotes & Cross References", children: expandedVerse === verse.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => handleEditStart(verse), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", onClick: () => {
                  setVerseToDelete(verse);
                  setDeleteDialogOpen(true);
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })
              ] })
            ] }),
            expandedVerse === verse.id && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 pt-4 border-t space-y-4", children: loadingFootnotes === verse.id ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-muted-foreground" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-medium flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-4 h-4" }),
                    "Footnotes"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                    setSelectedVerseForAdd(verse);
                    setAddFootnoteDialogOpen(true);
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                    "Add"
                  ] })
                ] }),
                footnotes[verse.id]?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No footnotes" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: footnotes[verse.id]?.map((footnote) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/50 rounded-md p-3 text-sm relative group", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-primary mr-2", children: getLocalizedText(footnote.marker, "en") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getLocalizedText(footnote.note, "en") }),
                  getLocalizedText(footnote.note, "am") && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-1", children: getLocalizedText(footnote.note, "am") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => handleEditFootnote(footnote, verse.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => handleDeleteFootnote(footnote.id, verse.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-destructive" }) })
                  ] })
                ] }, footnote.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-sm font-medium flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-4 h-4" }),
                    "Cross References"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => {
                    setSelectedVerseForAdd(verse);
                    setAddCrossRefDialogOpen(true);
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3 mr-1" }),
                    "Add"
                  ] })
                ] }),
                crossRefs[verse.id]?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No cross references" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: crossRefs[verse.id]?.map((ref) => {
                  const joinedBook = ref.bible_books;
                  const refBook = joinedBook || allBooks.find((b) => b.id === ref.reference_book_id);
                  const refBookName = refBook ? getLocalizedName(refBook.name) : getLocalizedText(ref.reference, "en") || "Unknown";
                  const verseRange = ref.reference_verse_end ? `${ref.reference_verse_start}-${ref.reference_verse_end}` : String(ref.reference_verse_start || "");
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-primary/10 text-primary rounded-md px-2 py-1 text-sm flex items-center gap-1 group", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      refBookName,
                      " ",
                      ref.reference_chapter,
                      ":",
                      verseRange
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity", onClick: () => handleDeleteCrossRef(ref.id, verse.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" }) })
                  ] }, ref.id);
                }) })
              ] })
            ] }) })
          ] }) }, verse.id);
        }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (page - 1) * 200 + 1,
            " to ",
            Math.min(page * 200, total),
            " of",
            " ",
            total,
            " verses"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page - 1), disabled: page <= 1, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-4 h-4" }),
              "Previous"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handlePageChange(page + 1), disabled: page >= totalPages, children: [
              "Next",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deleteDialogOpen, onOpenChange: setDeleteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Verse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Are you sure you want to delete verse ",
          verseToDelete?.verse_number,
          "? This action cannot be undone."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDeleteDialogOpen(false), disabled: isDeleting, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: handleDelete, disabled: isDeleting, children: isDeleting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Deleting..."
        ] }) : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createVerseDialogOpen, onOpenChange: setCreateVerseDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Verse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Add a new verse to ",
          bookName,
          " Chapter ",
          typedChapter.chapter_number
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        createVerseForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(createVerseForm.Field, { name: "verse_number", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "verse_number", children: "Verse Number *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "verse_number", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(parseInt(e.target.value) || 1) }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createVerseForm.Field, { name: "text_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "text_en", children: "English Text *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "text_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 4 }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createVerseForm.Field, { name: "text_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "text_am", children: "Amharic Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "text_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 4 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setCreateVerseDialogOpen(false), disabled: isCreatingVerse, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isCreatingVerse, children: isCreatingVerse ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Creating..."
          ] }) : "Create Verse" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addFootnoteDialogOpen, onOpenChange: setAddFootnoteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Footnote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Add a footnote to verse ",
          selectedVerseForAdd?.verse_number
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        createFootnoteForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(createFootnoteForm.Field, { name: "marker_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marker_en", children: "Marker (EN) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "marker_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), placeholder: "e.g., [a], [1]" }),
            field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(createFootnoteForm.Field, { name: "marker_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "marker_am", children: "Marker (AM)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "marker_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), placeholder: "Optional" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createFootnoteForm.Field, { name: "note_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "note_en", children: "Note (EN) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "note_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 3 }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createFootnoteForm.Field, { name: "note_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "note_am", children: "Note (AM)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "note_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 3 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setAddFootnoteDialogOpen(false), disabled: isCreatingFootnote, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isCreatingFootnote, children: isCreatingFootnote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Adding..."
          ] }) : "Add Footnote" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editFootnoteDialogOpen, onOpenChange: setEditFootnoteDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit Footnote" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Update the footnote details" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        editFootnoteForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(editFootnoteForm.Field, { name: "marker_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit_marker_en", children: "Marker (EN) *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit_marker_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), placeholder: "e.g., [a], [1]" }),
            field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(editFootnoteForm.Field, { name: "marker_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit_marker_am", children: "Marker (AM)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "edit_marker_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), placeholder: "Optional" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(editFootnoteForm.Field, { name: "note_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit_note_en", children: "Note (EN) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "edit_note_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 3 }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(editFootnoteForm.Field, { name: "note_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "edit_note_am", children: "Note (AM)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "edit_note_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), rows: 3 })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setEditFootnoteDialogOpen(false), disabled: isUpdatingFootnote, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isUpdatingFootnote, children: isUpdatingFootnote ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Saving..."
          ] }) : "Save Changes" })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: addCrossRefDialogOpen, onOpenChange: setAddCrossRefDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add Cross Reference" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Add a cross reference to verse ",
          selectedVerseForAdd?.verse_number
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        createCrossRefForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(createCrossRefForm.Field, { name: "reference_book_id", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Book *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.state.value, onValueChange: (value) => field.handleChange(value || ""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a book" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: allBooks.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: b.id, children: getLocalizedName(b.name) }, b.id)) })
          ] }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createCrossRefForm.Field, { name: "reference_chapter", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ref_chapter", children: "Chapter *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "ref_chapter", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(parseInt(e.target.value) || 1) }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(createCrossRefForm.Field, { name: "reference_verse_start", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reference_verse_start", children: "Start Verse *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reference_verse_start", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(parseInt(e.target.value) || 1) }),
            field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: String(field.state.meta.errors[0]) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(createCrossRefForm.Field, { name: "reference_verse_end", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reference_verse_end", children: "End Verse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reference_verse_end", type: "number", min: 0, value: field.state.value || "", onChange: (e) => {
              const val = e.target.value ? parseInt(e.target.value) : 0;
              field.handleChange(val);
            }, placeholder: "Optional" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setAddCrossRefDialogOpen(false), disabled: isCreatingCrossRef, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isCreatingCrossRef, children: isCreatingCrossRef ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Adding..."
          ] }) : "Add Reference" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  ChapterDetailPage as component
};
