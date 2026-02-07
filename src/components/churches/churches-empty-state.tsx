import { Button } from "@/components/ui/button";
import { Church, Plus } from "lucide-react";

interface ChurchesEmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onAdd: () => void;
}

export function ChurchesEmptyState({
  hasFilters,
  onClearFilters,
  onAdd,
}: ChurchesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
        <Church className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {hasFilters ? "No matching churches" : "No churches yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-5">
        {hasFilters
          ? "Try adjusting your search or filter criteria to find what you're looking for."
          : "Get started by adding your first church to the platform."}
      </p>
      {hasFilters ? (
        <Button variant="outline" onClick={onClearFilters}>
          Clear Filters
        </Button>
      ) : (
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Church
        </Button>
      )}
    </div>
  );
}
