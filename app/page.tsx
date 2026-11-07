"use cache";

import { cacheTag, cacheLife } from "next/cache";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import type { EventItem } from "@/constants";
import { Event } from "@/database";
import connectDB from "@/lib/mongodb";


export default async function Home() {
  cacheTag("events");
  cacheLife('hours');
  let events: Pick<EventItem, "image" | "slug" | "title" | "location" | "date" | "time">[] = [];
  let eventsError: string | null = null;

  try {
    await connectDB();
    events = await Event.find()
      .sort({ createdAt: -1 })
      .select("image slug title location date time -_id")
      .lean();
      
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
                        <EventCard {...event} />
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