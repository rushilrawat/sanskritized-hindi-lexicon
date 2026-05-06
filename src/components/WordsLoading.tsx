import { Skeleton } from "@/components/ui/skeleton";

const WordsLoading = () => (
  <div className="container-page pt-6 sm:pt-8">
    <div className="text-center mb-6 space-y-3">
      <Skeleton className="h-7 w-64 mx-auto" />
      <Skeleton className="h-3 w-80 max-w-full mx-auto" />
    </div>
    <Skeleton className="h-11 w-full max-w-xl mx-auto rounded-lg" />
    <div className="flex gap-1 justify-center mt-3">
      {Array.from({ length: 26 }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-6 rounded" />
      ))}
    </div>
    <div className="space-y-3 mt-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="card-elevated p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="h-3 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <Skeleton className="h-14 w-full rounded-md" />
            <Skeleton className="h-14 w-full rounded-md" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default WordsLoading;
