import { createFileRoute, useNavigate, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { getBibleBooks, getBibleBookStats, deleteBibleBook, createBibleBook } from "@/api/bible";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Book,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Plus,
  BookMarked,
  ScrollText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import type { BibleBook } from "@/api/bible";

// Validation schema for creating a book
const createBookSchema = z.object({
  book_number: z.number().min(1, "Book number is required"),
  chapter_count: z.number().min(1, "Chapter count is required"),
  name_en: z.string().min(1, "English name is required"),
  name_am: z.string(),
  testament: z.enum(["old", "new"]),
});

type Testament = "old" | "new" | undefined;

export const Route = createFileRoute("/_authenticated/dashboard/bible/")({
  validateSearch: (
    search: Record<string, unknown>
  ): { testament: Testament; page: number; search: string } => ({
    testament: search.testament
      ? (search.testament as Testament)
      : undefined,
    page: Number(search.page) || 1,
    search: (search.search as string) || "",
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [booksData, stats] = await Promise.all([
      getBibleBooks({
        data: {
          page: deps.page,
          limit: 66,
          search: deps.search,
          testament: deps.testament,
        },
      }),
      getBibleBookStats(),
    ]);
    return { ...booksData, stats };
  },
  pendingComponent: BibleLoadingSkeleton,
  errorComponent: BibleErrorState,
  component: BibleBooksPage,
});

// Loading Skeleton Component
function BibleLoadingSkeleton() {
  return (
    <div className="flex flex-col h-full">
      
      <div className="flex-1 overflow-auto p-4">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>

        {/* Filters Skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error State Component
function BibleErrorState({ error }: { error: Error }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Failed to Load Bible Books</h2>
          <p className="text-muted-foreground mb-4">
            {error.message || "An unexpected error occurred while loading the Bible content."}
          </p>
          <Button onClick={() => navigate({ to: "/dashboard/bible", search: { testament: undefined, page: 1, search: "" } })}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function BibleEmptyState({ 
  searchTerm, 
  testament,
  onAddBook,
}: { 
  searchTerm: string; 
  testament: Testament;
  onAddBook: () => void;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No Books Found</h2>
        <p className="text-muted-foreground mb-4">
          {searchTerm
            ? `No Bible books match "${searchTerm}".`
            : testament
            ? `No books found in the ${testament === "old" ? "Old" : "New"} Testament.`
            : "No Bible books have been added yet."}
        </p>
        <div className="flex gap-2 justify-center">
          {(searchTerm || testament) && (
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  to: "/dashboard/bible",
                  search: { testament: undefined, page: 1, search: "" },
                })
              }
            >
              Clear Filters
            </Button>
          )}
          <Button onClick={onAddBook}>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>
    </div>
  );
}

function BibleBooksPage() {
  const { books, total, page, totalPages, stats } = Route.useLoaderData();
  const { testament, search } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(search || "");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BibleBook | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const createForm = useForm({
    defaultValues: {
      book_number: 1,
      chapter_count: 1,
      name_en: "",
      name_am: "",
      testament: "old" as "old" | "new",
    },
    validators: {
      onChange: createBookSchema,
    },
    onSubmit: async ({ value }) => {
      setIsCreating(true);
      try {
        await createBibleBook({
          data: {
            book_number: value.book_number,
            chapter_count: value.chapter_count,
            name: {
              en: value.name_en,
              am: value.name_am || undefined,
            },
            testament: {
              en: value.testament === "old" ? "Old Testament" : "New Testament",
              am: value.testament === "old" ? "ብሉይ ኪዳን" : "አዲስ ኪዳን",
            },
          },
        });
        setCreateDialogOpen(false);
        createForm.reset();
        router.invalidate();
      } catch (error) {
        console.error("Failed to create book:", error);
      } finally {
        setIsCreating(false);
      }
    },
  });

  const getLocalizedName = (name: unknown): string => {
    if (typeof name === "object" && name !== null) {
      const nameObj = name as { en?: string; am?: string };
      return nameObj.en || nameObj.am || "Unknown";
    }
    return String(name || "Unknown");
  };

  const handleSearch = () => {
    navigate({
      search: { testament, page: 1, search: searchInput },
    });
  };

  const handleTestamentFilter = (newTestament: string) => {
    navigate({
      search: {
        testament: newTestament === "all" ? undefined : (newTestament as Testament),
        page: 1,
        search: searchInput,
      },
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { testament, page: newPage, search },
    });
  };

  const handleDelete = async () => {
    if (!bookToDelete) return;
    setIsDeleting(true);
    try {
      await deleteBibleBook({ data: { id: bookToDelete.id } });
      setDeleteDialogOpen(false);
      setBookToDelete(null);
      navigate({ to: "/dashboard/bible", search: { testament, page, search } });
    } catch (error) {
      console.error("Failed to delete book:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const typedBooks = books as BibleBook[];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-4">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Bible Content</h1>
            <p className="text-muted-foreground">
              Manage Bible books, chapters, and verses
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Book
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Book className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Books</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-full">
                <ScrollText className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Old Testament</p>
                <p className="text-2xl font-bold">{stats.oldTestament}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <BookMarked className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">New Testament</p>
                <p className="text-2xl font-bold">{stats.newTestament}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Select
            value={testament || "all"}
            onValueChange={(value) => handleTestamentFilter(value || "all")}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by testament" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Testaments</SelectItem>
              <SelectItem value="old">Old Testament</SelectItem>
              <SelectItem value="new">New Testament</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Empty State */}
        {typedBooks.length === 0 ? (
          <BibleEmptyState searchTerm={search} testament={testament} onAddBook={() => setCreateDialogOpen(true)} />
        ) : (
          <>
            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
              {typedBooks.map((book) => {
                const testamentText = getLocalizedName(book.testament);
                const isOldTestament = testamentText.toLowerCase().includes("old");

                return (
                  <div
                    key={book.id}
                    className="bg-card rounded-lg border hover:shadow-md transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`p-2 rounded-full ${
                            isOldTestament
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {getLocalizedName(book.name)}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {testamentText}
                          </p>
                        </div>
                        <span className="text-xs font-medium bg-muted px-2 py-1 rounded">
                          #{book.book_number}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {book.chapter_count} chapters
                        </span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            render={
                              <Link
                                to="/dashboard/bible/$bookId"
                                params={{ bookId: book.id }}
                                search={{ page: 1 }}
                              />
                            }
                            nativeButton={false}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setBookToDelete(book);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 66 + 1} to {Math.min(page * 66, total)} of{" "}
                  {total} books
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Book</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{bookToDelete && getLocalizedName(bookToDelete.name)}"?
              This will also delete all chapters and verses in this book. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Book Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Add a new book to the Bible. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              createForm.handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <createForm.Field name="book_number">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="book_number">Book Number</Label>
                    <Input
                      id="book_number"
                      type="number"
                      min={1}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </createForm.Field>
              <createForm.Field name="chapter_count">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor="chapter_count">Chapter Count</Label>
                    <Input
                      id="chapter_count"
                      type="number"
                      min={1}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                    />
                    {field.state.meta.errors?.length > 0 && (
                      <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                    )}
                  </div>
                )}
              </createForm.Field>
            </div>
            <createForm.Field name="name_en">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name_en">English Name</Label>
                  <Input
                    id="name_en"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g., Genesis"
                  />
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </createForm.Field>
            <createForm.Field name="name_am">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name_am">Amharic Name (Optional)</Label>
                  <Input
                    id="name_am"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g., ዘፍጥረት"
                  />
                </div>
              )}
            </createForm.Field>
            <createForm.Field name="testament">
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="testament">Testament</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value as "old" | "new")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select testament" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="old">Old Testament</SelectItem>
                      <SelectItem value="new">New Testament</SelectItem>
                    </SelectContent>
                  </Select>
                  {field.state.meta.errors?.length > 0 && (
                    <p className="text-xs text-destructive">{String(field.state.meta.errors[0])}</p>
                  )}
                </div>
              )}
            </createForm.Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Book"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
