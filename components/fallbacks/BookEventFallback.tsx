import { Skeleton } from "@/components/ui/skeleton";


export default function BookEventFallback() {
  return (
    <div id="book-event" aria-busy="true">
      <output className="sr-only">Loading booking form</output>
      <form aria-hidden="true">
        <div>
          <Skeleton className="h-5 w-28 bg-dark-200" />
          <Skeleton className="h-11 w-full rounded-[6px] bg-dark-200" />
        </div>

        <button type="button" className="button-submit" disabled>
          <Skeleton className="mx-auto h-5 w-20 bg-black/20" />
        </button>
      </form>
    </div>
  );
}