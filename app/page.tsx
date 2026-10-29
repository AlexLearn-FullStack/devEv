import ExploreBtn from "@/components/ExploreBtn";


export default function Home() {
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
    </section>
  );
}