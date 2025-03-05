import { Search } from "lucide-react";
import { Button } from "../ui/button";

export function Searcher() {
  return (
    <form className="relative ml-10">
      <input
        placeholder="Unicornio, oso, doraemon..."
        className="flex h-10 w-full rounded-full bg-secondary px-6 py-2 text-base placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      <Button
        type="button"
        size="icon"
        className="absolute -left-8 top-0.5 rounded-full bg-gray-900"
      >
        <Search className="!size-5" />
      </Button>
    </form>
  );
}
