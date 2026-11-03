import { Skeleton } from "@/components/ui/skeleton";


export default function EventCardFallback() {
  return (
    <div id="event-card" aria-busy="true">
      <output className="sr-only">Loading event</output>
      <Skeleton className="poster bg-dark-200" aria-hidden="true" />

      <div className="flex flex-row gap-2" aria-hidden="true">
        <Skeleton className="size-3.5 shrink-0 bg-dark-200" />
        <Skeleton className="h-5 w-2/3 bg-dark-200" />
      </div>

      <Skeleton className="title h-6 w-4/5 bg-dark-200" aria-hidden="true" />

      <div className="datetime" aria-hidden="true">
        <div>
          <Skeleton className="size-3.5 shrink-0 bg-dark-200" />
          <Skeleton className="h-5 w-24 bg-dark-200" />
        </div>
        <div>
          <Skeleton className="size-3.5 shrink-0 bg-dark-200" />
          <Skeleton className="h-5 w-20 bg-dark-200" />
        </div>
      </div>
    </div>
  );
}