/** biome-ignore-all lint/suspicious/noImplicitAnyLet: initial */
import Image from "next/image";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { BASE_URL } from "@/constants";
import BookEvent from "@/components/BookEvent";
import type { IEvent } from "@/database";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";


export const instant = false;

const EventDetailItem = (
  { alt, icon, label }: {
    icon: string;
    alt: string;
    label: string;
  }
) => (
  <div className="flex-row-gap-2 items-center">
    <Image
      src={ icon }
      alt={ alt }
      width={17} height={17}
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
          (item) => <li key={item}>{ item }</li>
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


export default async function EventDetailsPage (
  { params }: { params: Promise<{ slug: string }> }
) {
  "use cache";
  cacheLife("hours");

  const { slug } = await params;

  let event;
  try {
    const req = await fetch(`${BASE_URL}/events/${slug}`, {
      next: { revalidate: 60 }
    });

    if (req.status !== 404 && !req.ok) {
      throw new Error(`Failed to fetch event details: ${req.statusText}`);
    }

    if (req.status !== 404) {
      const response = await req.json();
      event = response.event;
    }
    
  } catch (e) {
    console.error(`Error fetching event details: ${e}`);
    throw e;
  }

  if (!event) return notFound();

  const {
    title, description, image, overview,
    date, time, location, organizer,
    mode, agenda, audience, tags
  } = event;

  const bookings = 10;

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  return (
    <section id="event">
      <div className="header">
        <h1>{ title }</h1>
        <p>{ description }</p>
      </div>

      <div className="details">
        {/* Details section */}
        <div className="content">
          <Image
            src={ image }
            alt="Event banner"
            height={800} width={800}
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
              label={ time }
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

        {/* Booking Section */}
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
              eventId={ event._id }
              slug={ slug }
            />
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>

        <div className="events">
          {
            similarEvents.length > 0
              && similarEvents.map(
                (event: IEvent) => (
                  <EventCard
                    key={ event.slug }
                    { ...event }
                  />
                )
              )
          }
        </div>
      </div>
    </section>
  )
}