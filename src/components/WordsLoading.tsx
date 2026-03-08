import { Skeleton } from "@/components/ui/skeleton";

const WordsLoading = () => (
  <div className="container-page space-y-4 pt-8">
    <Skeleton className="h-8 w-48 mx-auto" />
    <Skeleton className="h-4 w-64 mx-auto" />
    <div className="space-y-3 mt-8">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-24 w-full rounded-lg" />
      ))}
    </div>
  </div>
);

export default WordsLoading;
