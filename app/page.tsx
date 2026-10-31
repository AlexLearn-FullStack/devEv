"use cache";

import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { BASE_URL } from "@/constants";
import type { IEvent } from "@/database";
// import { events } from "@/constants";



export default async function Home() {
  const response = await fetch(`${BASE_URL}/events`);
  const { events } = await response.json();

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
            events && events.length > 0
              && events.map(
                (event: IEvent) => (
                  <li key={event.slug}>
                    <EventCard {...event} />
                  </li>
                )
              )
          }
        </ul>
      </div>
    </section>
  );
}