import CreateEventForm from "@/components/CreateEventForm";


export default function Page() {
  return (
    <section className="w-full">
      <h1 className="mb-8 text-left sm:mb-5 sm:text-center">
        Create an Event
      </h1>

      <p className="text-center my-5 text-sm">
        All the forms fields are required
        <span className="text-[tomato]">*</span>
      </p>

      <CreateEventForm />
    </section>
  );
}