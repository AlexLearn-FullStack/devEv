"use cache";

import { cacheTag, cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { BASE_URL } from "@/constants";
import type { IEvent } from "@/database";


export default async function Home() {
  cacheTag("events");
  cacheLife('hours');
  let events: IEvent[] = [];
  let eventsError: string | null = null;

  try {
    const response = await fetch(`${BASE_URL}/events`);
    if (!response.ok) {
      throw new Error(`Events request failed with status ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("events" in payload) ||
      !Array.isArray(payload.events)
    ) {
      throw new Error("Events response did not contain an events array");
    }

    events = payload.events as IEvent[];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    eventsError = "Events are temporarily unavailable. Please try again later.";
  }

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev
        <br />
        Event You Mustn't miss
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in one place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7" id="events">
        <h3>Featured Events</h3>

        <ul className="events list-none">
          {
            eventsError
              ? (
                <li role="alert">{eventsError}</li>
              )
              : events.length > 0
                ? (
                  events.map(
                    (event) => (
                      <li key={event.slug}>
                        <EventCard
                          {...event}
                          mode={event.mode as "online" | "onsite" | "hybrid"}
                        />
                      </li>
                    )
                  )
                ) : (
                  <li>No events are available right now.</li>
                )
          }
        </ul>
      </div>
    </section>
  );
}