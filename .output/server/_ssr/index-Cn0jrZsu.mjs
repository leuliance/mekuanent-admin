import { r as reactExports, j as jsxRuntimeExports } from "../_chunks/_libs/react.mjs";
import { e as useNavigate, u as useRouter, L as Link } from "../_chunks/_libs/@tanstack/react-router.mjs";
import { u as useForm } from "../_chunks/_libs/@tanstack/react-form.mjs";
import { a1 as Route$8, a3 as deleteBibleBook, a2 as createBibleBook } from "./router-deJypcsT.mjs";
import { B as Button } from "./button-CY9keWpU.mjs";
import { I as Input } from "./input-Dw08o6Om.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DPIPNRXp.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogDescription, e as DialogFooter } from "./dialog-BpN664B5.mjs";
import { L as Label } from "./label-669ictw7.mjs";
import { H as Plus, ac as Book, ad as ScrollText, ae as BookMarked, af as Search, B as BookOpen, E as Eye, N as Trash2, _ as ChevronLeft, g as ChevronRight, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as object, _ as _enum, s as string, n as number } from "../_libs/zod.mjs";
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
const createBookSchema = object({
  book_number: number().min(1, "Book number is required"),
  chapter_count: number().min(1, "Chapter count is required"),
  name_en: string().min(1, "English name is required"),
  name_am: string(),
  testament: _enum(["old", "new"])
});
function BibleEmptyState({
  searchTerm,
  testament,
  onAddBook
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold mb-2", children: "No Books Found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-4", children: searchTerm ? `No Bible books match "${searchTerm}".` : testament ? `No books found in the ${testament === "old" ? "Old" : "New"} Testament.` : "No Bible books have been added yet." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-center", children: [
      (searchTerm || testament) && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => navigate({
        to: "/dashboard/bible",
        search: {
          testament: void 0,
          page: 1,
          search: ""
        }
      }), children: "Clear Filters" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: onAddBook, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
        "Add Book"
      ] })
    ] })
  ] }) });
}
function BibleBooksPage() {
  const {
    books,
    total,
    page,
    totalPages,
    stats
  } = Route$8.useLoaderData();
  const {
    testament,
    search
  } = Route$8.useSearch();
  const navigate = useNavigate({
    from: Route$8.fullPath
  });
  const router = useRouter();
  const [searchInput, setSearchInput] = reactExports.useState(search || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = reactExports.useState(false);
  const [bookToDelete, setBookToDelete] = reactExports.useState(null);
  const [isDeleting, setIsDeleting] = reactExports.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = reactExports.useState(false);
  const [isCreating, setIsCreating] = reactExports.useState(false);
  const createForm = useForm({
    defaultValues: {
      book_number: 1,
      chapter_count: 1,
      name_en: "",
      name_am: "",
      testament: "old"
    },
    validators: {
      onChange: createBookSchema
    },
    onSubmit: async ({
      value
    }) => {
      setIsCreating(true);
      try {
        await createBibleBook({
          data: {
            book_number: value.book_number,
            chapter_count: value.chapter_count,
            name: {
              en: value.name_en,
              am: value.name_am || void 0
            },
            testament: {
              en: value.testament === "old" ? "Old Testament" : "New Testament",
              am: value.testament === "old" ? "ብሉይ ኪዳን" : "አዲስ ኪዳን"
            }
          }
        });
        setCreateDialogOpen(false);
        createForm.reset();
        router.invalidate();
      } catch (error) {
        console.error("Failed to create book:", error);
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
  const handleSearch = () => {
    navigate({
      search: {
        testament,
        page: 1,
        search: searchInput
      }
    });
  };
  const handleTestamentFilter = (newTestament) => {
    navigate({
      search: {
        testament: newTestament === "all" ? void 0 : newTestament,
        page: 1,
        search: searchInput
      }
    });
  };
  const handlePageChange = (newPage) => {
    navigate({
      search: {
        testament,
        page: newPage,
        search
      }
    });
  };
  const handleDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBibleBook({
        data: {
          id: bookToDelete.id
        }
      });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      navigate({
        to: "/dashboard/bible",
        search: {
          testament,
          page,
          search
        }
      });
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
    }
  };
  const typedBooks = books;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: "Bible Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Manage Bible books, chapters, and verses" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setCreateDialogOpen(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-2" }),
          "Add Book"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Book, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Total Books" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: stats.total })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-amber-500/10 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollText, { className: "w-5 h-5 text-amber-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Old Testament" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: stats.oldTestament })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-blue-500/10 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookMarked, { className: "w-5 h-5 text-blue-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "New Testament" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold", children: stats.newTestament })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Search books...", value: searchInput, onChange: (e) => setSearchInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "pl-10" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: testament || "all", onValueChange: (value) => handleTestamentFilter(value || "all"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-48", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Filter by testament" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Testaments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "old", children: "Old Testament" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "New Testament" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: handleSearch, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 mr-2" }),
          "Search"
        ] })
      ] }),
      typedBooks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(BibleEmptyState, { searchTerm: search, testament, onAddBook: () => setCreateDialogOpen(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6", children: typedBooks.map((book) => {
          const testamentText = getLocalizedName(book.testament);
          const isOldTestament = testamentText.toLowerCase().includes("old");
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card rounded-lg border hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `p-2 rounded-full ${isOldTestament ? "bg-amber-500/10 text-amber-500" : "bg-blue-500/10 text-blue-500"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-medium truncate", children: getLocalizedName(book.name) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: testamentText })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium bg-muted px-2 py-1 rounded", children: [
                "#",
                book.book_number
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                book.chapter_count,
                " chapters"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", render: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard/bible/$bookId", params: {
                  bookId: book.id
                }, search: {
                  page: 1
                } }), nativeButton: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => {
                  setBookToDelete(book);
                  setDeleteDialogOpen(true);
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })
              ] })
            ] })
          ] }) }, book.id);
        }) }),
        totalPages > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "Showing ",
            (page - 1) * 66 + 1,
            " to ",
            Math.min(page * 66, total),
            " of",
            " ",
            total,
            " books"
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete Book" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          'Are you sure you want to delete "',
          bookToDelete && getLocalizedName(bookToDelete.name),
          '"? This will also delete all chapters and verses in this book. This action cannot be undone.'
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
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Add New Book" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Add a new book to the Bible. Fill in the details below." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        e.stopPropagation();
        createForm.handleSubmit();
      }, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "book_number", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "book_number", children: "Book Number" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "book_number", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(Number(e.target.value)), onBlur: field.handleBlur }),
            field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: String(field.state.meta.errors[0]) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "chapter_count", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "chapter_count", children: "Chapter Count" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "chapter_count", type: "number", min: 1, value: field.state.value, onChange: (e) => field.handleChange(Number(e.target.value)), onBlur: field.handleBlur }),
            field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: String(field.state.meta.errors[0]) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "name_en", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name_en", children: "English Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name_en", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, placeholder: "e.g., Genesis" }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "name_am", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name_am", children: "Amharic Name (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "name_am", value: field.state.value, onChange: (e) => field.handleChange(e.target.value), onBlur: field.handleBlur, placeholder: "e.g., ዘፍጥረት" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(createForm.Field, { name: "testament", children: (field) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "testament", children: "Testament" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: field.state.value, onValueChange: (value) => field.handleChange(value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select testament" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "old", children: "Old Testament" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "new", children: "New Testament" })
            ] })
          ] }),
          field.state.meta.errors?.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: String(field.state.meta.errors[0]) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setCreateDialogOpen(false), disabled: isCreating, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isCreating, children: isCreating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Creating..."
          ] }) : "Create Book" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BibleBooksPage as component
};
