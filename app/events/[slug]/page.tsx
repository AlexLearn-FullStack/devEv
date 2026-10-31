import { BASE_URL } from "@/constants";
import { notFound } from "next/navigation";


export const instant = false;

export default async function EventDetailsPage (
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const req = await fetch(`${BASE_URL}/events/${slug}`);
  const event = await req.json();

  if (!event) return notFound();
  
  return (
    <section id="event">
      <h1>
        Event Details:
        <br />
        { slug }
      </h1>
    </section>
  )
}