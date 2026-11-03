import { Suspense } from "react";
import EventDetails from "@/components/EventDetails";
import EventDetailsFallback from "@/components/fallbacks/EventDetailsFallback";


export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={ <EventDetailsFallback /> }>
      <EventDetails params={ params } />
    </Suspense>
  );
}