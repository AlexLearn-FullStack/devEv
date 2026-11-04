import { Suspense } from "react";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/constants";
import BookEvent from "@/components/BookEvent";
import type { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";
import EventCardFallback from "@/components/fallbacks/EventCardFallback";


const EventDetailItem = ({
  alt,
  icon,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image
      src={ icon }
      alt={ alt }
      width={17}
      height={17}
    />
    <p>{ label }</p>
  </div>
);

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {
        agendaItems?.map(
          (item) => <li key={item}>
            { item[0].toUpperCase() + item.slice(1) }
          </li>
        )
      }
    </ul>
  </div>
);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1 5 flex-wrap">
    {
      tags?.map(
        (tag) => <div className="pill" key={tag}>{ tag }</div>
      )
    }
  </div>
);


function SimilarEventsFallback() {
  return (
    <div className="events">
      {
        [1, 2, 3].map(
          (i) => <EventCardFallback key={i} />
        )
      }
    </div>
  );
}


async function SimilarEvents({ slug }: { slug: string }) {
  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <div className="events">
      {
        similarEvents.length > 0
          ?
            similarEvents.map(
              (event: IEvent) => (
                <EventCard
                  key={event.slug}
                  {...event}
                  mode={event.mode as "onsite" | "online" | "hybrid"}
                />
              )
            )
          : (
            <p className="text-sm sm:text-lg indent-4">
              It seems this event is one of a kind.
            </p>
          )
      }
    </div>
  );
}


export default async function EventDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <CachedEventDetails slug={slug} />;
}


async function CachedEventDetails({ slug }: { slug: string }) {
  "use cache";
  cacheTag("events");
  cacheLife("hours");

  let event: IEvent | undefined;
  try {
    const req = await fetch(`${BASE_URL}/events/${slug}`, {
      next: { revalidate: 60 },
    });

    if (req.status !== 404 && !req.ok) {
      throw new Error(`Failed to fetch event details: ${req.statusText}`);
    }

    if (req.status !== 404) {
      const response = await req.json();
      event = response.event;
    }
  } catch (error) {
    console.error(`Error fetching event details: ${error}`);
    throw error;
  }

  if (!event) return notFound();

  const {
    title, description, image,
    overview, date, time,
    location, organizer, mode,
    agenda, audience, tags
  } = event;

  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1 className="capitalize">{ title }</h1>
        <p>{ description }</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={ image }
            alt="Event banner"
            height={800}
            width={800}
            className="banner"
          />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{ overview }</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={ date }
            />

            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={`${ time } UTC `}
            />

            <EventDetailItem
              icon="/icons/pin.svg"
              alt="pin"
              label={ location }
            />

            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={ mode }
            />

            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={ audience }
            />
          </section>

          <EventAgenda agendaItems={ agenda } />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{ organizer }</p>
          </section>

          <EventTags tags={ tags } />
        </div>

        <aside className="booking">
          <div className="signup-card">
            <h2>Book your spot</h2>

            {
              bookings > 0
                ? (
                  <p className="text-sm">
                    Join { bookings } people who have already booked their spot!
                  </p>
                )
                : (
                  <p className="text-sm">Be the first to book your spot!</p>
                )
            }

            <BookEvent
              eventId={ event._id.toString() }
              slug={ slug }
            />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>

        <Suspense fallback={ <SimilarEventsFallback /> }>
          <SimilarEvents slug={slug} />
        </Suspense>
      </div>
    </section>
  );
}