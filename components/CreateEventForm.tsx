"use client";

import { useState } from "react";
import { ChevronDown, CloudUpload } from "lucide-react";
import EventFormField from "@/components/EventFormField";

const controlClasses =
  "w-full rounded-md border border-[#263f48] bg-dark-200 px-3.5 py-3 text-sm text-light-100 placeholder:text-[#c0d2d5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";


export default function CreateEventForm() {
  const [imageName, setImageName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  }

  return (
    <form
      className="mx-auto flex w-full max-w-175 flex-col gap-5 rounded-lg border border-[#192a30] bg-dark-100 p-5 sm:p-7"
      onSubmit={handleSubmit}
    >
      <EventFormField id="title" label="Event Title">
        <input
          className={controlClasses}
          id="title"
          name="title"
          type="text"
          placeholder="Enter event title"
          maxLength={100}
          required
        />
      </EventFormField>

      <EventFormField
        id="date"
        label="Event Date"
        helperText="Choose the event's start date."
      >
        <input
          className={`${controlClasses} scheme-dark`}
          id="date"
          name="date"
          type="date"
          required
        />
      </EventFormField>

      <EventFormField
        id="time"
        label="Event Time"
        helperText="Make sure the start time is in UTC format, or convert it to UTC before saving."
      >
        <input
          className={`${controlClasses} scheme-dark`}
          id="time"
          name="time"
          type="time"
          required
        />
      </EventFormField>

      <EventFormField
        id="venue"
        label="Venue"
        helperText="Enter the venue name, or use Online for a virtual event."
      >
        <input
          className={controlClasses}
          id="venue"
          name="venue"
          type="text"
          placeholder="Enter venue name"
          required
        />
      </EventFormField>

      <EventFormField
        id="location"
        label="Location"
        helperText="Enter the city and region, or the event's online link."
      >
        <input
          className={controlClasses}
          id="location"
          name="location"
          type="text"
          placeholder="Enter city, region, or online link"
          required
        />
      </EventFormField>

      <EventFormField
        id="mode"
        label="Event Mode"
      >
        <div className="relative">
          <select
            className={`${controlClasses} appearance-none pr-10`}
            id="mode"
            name="mode"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select event mode
            </option>
            <option value="online">Online</option>
            <option value="onsite">Onsite</option>
            <option value="hybrid">Hybrid</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-light-100"
          />
        </div>
      </EventFormField>

      <EventFormField
        id="image"
        label="Event Image / Banner"
        helperText="Choose an image file for the event banner."
      >
        <input
          className="peer sr-only"
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          onChange={(event) =>
            setImageName(event.currentTarget.files?.[0]?.name ?? "")
          }
        />
        <label
          className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#263f48] bg-dark-200 px-3.5 py-3 text-center text-sm text-light-100 transition-colors hover:bg-[#20343d] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary"
          htmlFor="image"
        >
          <CloudUpload aria-hidden="true" className="size-4 shrink-0" />
          <span aria-live="polite">
            {imageName || "Upload event image or banner"}
          </span>
        </label>
      </EventFormField>

      <EventFormField id="audience" label="Audience">
        <input
          className={controlClasses}
          id="audience"
          name="audience"
          type="text"
          placeholder="Who is this event for?"
          required
        />
      </EventFormField>

      <EventFormField
        id="organizer"
        label="Organizer"
        helperText="Enter the name and a brief introduction of the event organizer."
      >
        <input
          className={controlClasses}
          id="organizer"
          name="organizer"
          type="text"
          placeholder="Organizer name or organization"
          required
        />
      </EventFormField>

      <EventFormField
        id="agenda"
        label="Agenda"
        helperText="Put each agenda in a new line"
      >
        <textarea
          className={`${controlClasses} min-h-28 resize-none leading-[1.7]`}
          id="agenda"
          name="agenda"
          placeholder={`Agenda item 1\nAgenda item 2\nAgenda item 3`}
          required
        />
      </EventFormField>

      <EventFormField
        id="tags"
        label="Tags"
        helperText="Separate each tag with a comma."
      >
        <input
          className={controlClasses}
          id="tags"
          name="tags"
          type="text"
          placeholder="Add tags such as React, Next.js"
          required
        />
      </EventFormField>

      <EventFormField
        id="overview"
        label="Event Overview"
        helperText="Give attendees a quick summary (up to 500 characters)."
      >
        <textarea
          className={`${controlClasses} min-h-28 resize-none leading-[1.7]`}
          id="overview"
          name="overview"
          placeholder="Provide a short overview of the event"
          maxLength={500}
          required
        />
      </EventFormField>

      <EventFormField
        id="description"
        label="Event Description"
        helperText="Share more details about the event (up to 1,000 characters)."
      >
        <textarea
          className={`${controlClasses} min-h-40 resize-none leading-[1.7]`}
          id="description"
          name="description"
          placeholder="Briefly describe the event"
          maxLength={1000}
          required
        />
      </EventFormField>

      <button
        className="w-full cursor-pointer rounded-md bg-primary px-4 py-3 text-base font-semibold text-black transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        type="submit"
      >
        Save Event
      </button>
    </form>
  );
}