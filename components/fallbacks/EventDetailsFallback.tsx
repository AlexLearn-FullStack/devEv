import BookEventFallback from "@/components/fallbacks/BookEventFallback";
import EventCardFallback from "@/components/fallbacks/EventCardFallback";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailsFallback() {
  return (
    <section id="event" aria-busy="true">
      <div className="header">
        <h1 className="w-full space-y-2">
          <Skeleton className="h-14 w-4/5 bg-dark-200 max-sm:h-10" />
          <Skeleton className="h-14 w-2/5 bg-dark-200 max-sm:h-10" />
        </h1>
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-6 w-full bg-dark-200 max-sm:h-4" />
          <Skeleton className="h-6 w-4/5 bg-dark-200 max-sm:h-4" />
        </div>
      </div>

      <div className="details">
        <div className="content">
          <Skeleton className="banner aspect-square bg-dark-200" />

          <section className="flex-col-gap-2">
            <h2>
              <Skeleton className="h-8 w-36 bg-dark-200" />
            </h2>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-6 w-full bg-dark-200 max-sm:h-4" />
              <Skeleton className="h-6 w-11/12 bg-dark-200 max-sm:h-4" />
              <Skeleton className="h-6 w-4/5 bg-dark-200 max-sm:h-4" />
            </div>
          </section>

          <section className="flex-col-gap-2">
            <h2>
              <Skeleton className="h-8 w-44 bg-dark-200" />
            </h2>
            <div className="flex-row-gap-2 items-center">
              <Skeleton className="size-4.25 shrink-0 bg-dark-200" />
              <Skeleton className="h-6 w-2/3 bg-dark-200 max-sm:h-4" />
            </div>
            <div className="flex-row-gap-2 items-center">
              <Skeleton className="size-4.25 shrink-0 bg-dark-200" />
              <Skeleton className="h-6 w-1/2 bg-dark-200 max-sm:h-4" />
            </div>
            <div className="flex-row-gap-2 items-center">
              <Skeleton className="size-4.25 shrink-0 bg-dark-200" />
              <Skeleton className="h-6 w-3/4 bg-dark-200 max-sm:h-4" />
            </div>
            <div className="flex-row-gap-2 items-center">
              <Skeleton className="size-4.25 shrink-0 bg-dark-200" />
              <Skeleton className="h-6 w-1/3 bg-dark-200 max-sm:h-4" />
            </div>
            <div className="flex-row-gap-2 items-center">
              <Skeleton className="size-4.25 shrink-0 bg-dark-200" />
              <Skeleton className="h-6 w-1/2 bg-dark-200 max-sm:h-4" />
            </div>
          </section>

          <section className="agenda">
            <h2>
              <Skeleton className="h-8 w-28 bg-dark-200" />
            </h2>
            <ul>
              <li>
                <Skeleton className="inline-block h-6 w-4/5 bg-dark-200 max-sm:h-4" />
              </li>
              <li>
                <Skeleton className="inline-block h-6 w-2/3 bg-dark-200 max-sm:h-4" />
              </li>
              <li>
                <Skeleton className="inline-block h-6 w-3/4 bg-dark-200 max-sm:h-4" />
              </li>
            </ul>
          </section>

          <section className="flex-col-gap-2">
            <h2>
              <Skeleton className="h-8 w-60 bg-dark-200" />
            </h2>
            <Skeleton className="h-6 w-full bg-dark-200 max-sm:h-4" />
            <Skeleton className="h-6 w-3/4 bg-dark-200 max-sm:h-4" />
          </section>

          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-7 w-20 rounded-[6px] bg-dark-200" />
            <Skeleton className="h-7 w-24 rounded-[6px] bg-dark-200" />
            <Skeleton className="h-7 w-16 rounded-[6px] bg-dark-200" />
          </div>
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>
              <Skeleton className="h-8 w-40 bg-dark-200" />
            </h2>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-full bg-dark-200" />
              <Skeleton className="h-5 w-4/5 bg-dark-200" />
            </div>
            <BookEventFallback />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>
          <Skeleton className="h-8 w-48 bg-dark-200" />
        </h2>
        <div className="events">
          {
            [1,2,3].map(
              (i) => <EventCardFallback key={i} />
            )
          }
        </div>
      </div>
    </section>
  );
}