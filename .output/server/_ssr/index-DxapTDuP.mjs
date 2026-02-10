import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useForm } from "../_chunks/_libs/@tanstack/react-form.mjs";
import { ap as Route$1, ar as deleteBibleChapter, aq as createBibleChapter } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { ag as ArrowLeft, B as BookOpen, H as Plus, N as Trash2, _ as ChevronLeft, g as ChevronRight, L as LoaderCircle, F as FileText } from "../_libs/lucide-react.mjs";
import { o as object, n as number } from "../_libs/zod.mjs";
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
const createChapterSchema = object({
  chapter_number: number().min(1, "Chapter number is required"),
  verse_count: number().min(1, "Verse count is required")
});
function ChaptersEmptyState({
  bookName,
  onAddChapter
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: "No Chapters Found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-4", children: [
      bookName,
      " doesn't have any chapters yet."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onAddChapter, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
      "Add Chapter"
    ] })
  ] }) });
}
function BookDetailPage() {
  const {
    book,
    chapters,
    total,
    page,
    totalPages
  } = Route$1.useLoaderData();
  const {
    bookId
  } = Route$1.useParams();
  const navigate = useNavigate({
    from: Route$1.fullPath
  });
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [chapterToDelete, setChapterToDelete] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const typedBook = book;
  const typedChapters = chapters;
  const createForm = useForm({
    defaultValues: {
      chapter_number: (typedChapters.length || 0) + 1,
      verse_count: 1
    },
    validators: {
      onChange: createChapterSchema
    },
    onSubmit: async ({
      value
    }) => {
      setIsCreating(true);
      try {
        await createBibleChapter({
          data: {
            book_id: bookId,
            chapter_number: value.chapter_number,
            verse_count: value.verse_count
          }
        });
        setCreateDialogOpen(false);
        createForm.reset();
        router.invalidate();
      } catch (error) {
        console.error("Failed to create chapter:", error);
      } finally {
        setIsCreating(false);
      }
    }
  });
  const getLocalizedName = (name) => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name;
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };
  const bookName = getLocalizedName(typedBook.name);
  const testamentText = getLocalizedName(typedBook.testament);
  const isOldTestament = testamentText.toLowerCase().includes("old");
  const handlePageChange = (newPage) => {
    navigate({
      search: {
        page: newPage
      }
    });
  };
  const handleDelete = async () => {
    if (!chapterToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBibleChapter({
        data: {
          id: chapterToDelete.id
        }
      });
      setDeleteDialogOpen(false);
      setChapterToDelete(null);
      navigate({
        to: "/dashboard/bible/$bookId",
        params: {
          bookId
        },
        search: {
          page
        }
      });
    } catch (error) {
      console.error("Failed to delete chapter:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/bible", search: {
        testament: void 0,
        page: 1,
        search: ""
      } }), nativeButton: false, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-2" }),
        "Back to Books"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-4 rounded-full ${isOldTestament ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: bookName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground", children: [
              testamentText,
              " • Book #",
              typedBook.book_number,
              " • ",
              typedBook.chapter_count,
              " chapters"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
          "Add Chapter"
        ] })
      ] }),
      typedChapters.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChaptersEmptyState, { bookName, onAddChapter: () => setCreateDialogOpen(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold mb-3", children: "Chapters" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3 mb-6", children: typedChapters.map((chapter) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-lg border hover:shadow-md transition-all group relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard/bible/$bookId/$chapterId", params: {
            bookId,
            chapterId: chapter.id
          }, search: {
            page: 1,
            search: ""
          }, className: "block p-4 text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-primary mb-1", children: chapter.chapter_number }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              chapter.verse_count,
              " verses"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: (e) => {
            e.preventDefault();
            setChapterToDelete(chapter);
            setDeleteDialogOpen(true);
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 text-destructive" }) }) })
        ] }, chapter.id)) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (page - 1) * 150 + 1,
            " to ",
            Math.min(page * 150, total),
            " of",
            " ",
            total,
            " chapters"
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Chapter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Are you sure you want to delete Chapter ",
          chapterToDelete?.chapter_number,
          "? This will also delete all verses in this chapter. This action cannot be undone."
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
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: createDialogOpen, onOpenChange: setCreateDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Chapter" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Add a new chapter to ",
          bookName,
          ". Fill in the details below."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        createForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "chapter_number", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chapter_number", children: "Chapter Number" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "chapter_number", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(Number(e.target.value)), onBlur: field.handleBlur }),
          field.state.meta.errors[0] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: field.state.meta.errors[0]?.message })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "verse_count", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "verse_count", children: "Number of Verses" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "verse_count", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(Number(e.target.value)), onBlur: field.handleBlur }),
          field.state.meta.errors[0] && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: field.state.meta.errors[0]?.message })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setCreateDialogOpen(false), disabled: isCreating, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isCreating, children: isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Creating..."
          ] }) : "Create Chapter" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BookDetailPage as component
};
