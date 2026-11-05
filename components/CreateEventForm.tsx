"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, CloudUpload } from "lucide-react";
import EventFormField from "@/components/EventFormField";
import { useRouter } from "next/navigation";
import {
  handleSubmit as submitEvent,
  type EventField,
  type EventSubmissionResult,
} from "@/lib/utils";


const SUCCESS_REDIRECT_DELAY = 1000;


const controlClasses =
  "w-full rounded-md border border-[#263f48] bg-dark-200 px-3.5 py-3 text-sm text-light-100 placeholder:text-[#c0d2d5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";


export default function CreateEventForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [ imageName, setImageName ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ submissionResult, setSubmissionResult ] =
    useState<EventSubmissionResult | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current !== null) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const handleFieldChange = (event: React.ChangeEvent<HTMLFormElement>) => {
    const fieldName = event.target.name;

    setSubmissionResult((currentResult) => {
      if (
        !currentResult ||
        currentResult.success ||
        !currentResult.fieldErrors ||
        !(fieldName in currentResult.fieldErrors)
      ) {
        return currentResult;
      }

      const field = fieldName as EventField;
      const fieldErrors = { ...currentResult.fieldErrors };
      delete fieldErrors[field];
      return { ...currentResult, fieldErrors };
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmissionResult(null);
    const form = e.currentTarget;

    try {
      const result = await submitEvent(new FormData(form));
      setSubmissionResult(result);

      if (result.success) {
        form.reset();
        setImageName("");
        redirectTimeoutRef.current = setTimeout(
          () => router.replace("/"),
          SUCCESS_REDIRECT_DELAY,
        );
      }
    } catch (error) {
      setSubmissionResult({
        success: false,
        message:
          error instanceof Error
            ? `Unable to submit event: ${error.message}`
            : "Unable to submit event. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldErrors =
    submissionResult && !submissionResult.success
      ? submissionResult.fieldErrors ?? {}
      : {};

  return (
    <form
      ref={formRef}
      className="mx-auto flex w-full max-w-175 flex-col gap-5 rounded-lg border border-[#192a30] bg-dark-100 p-5 sm:p-7"
      onSubmit={handleSubmit}
      onChange={handleFieldChange}
      noValidate
    >
      <EventFormField
        id="title"
        label="Event Title"
        errorMessage={fieldErrors.title}
      >
        <input
          className={controlClasses}
          id="title"
          name="title"
          type="text"
          placeholder="Enter event title"
          maxLength={100}
          required
          aria-invalid={Boolean(fieldErrors.title)}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="date"
        label="Event Date"
        helperText="Choose the event's start date."
        errorMessage={fieldErrors.date}
      >
        <input
          className={`${controlClasses} scheme-dark`}
          id="date"
          name="date"
          type="date"
          required
          aria-invalid={Boolean(fieldErrors.date)}
          aria-describedby={fieldErrors.date ? "date-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="time"
        label="Event Time"
        helperText="Make sure the start time is in UTC format, or convert it to UTC before saving."
        errorMessage={fieldErrors.time}
      >
        <input
          className={`${controlClasses} scheme-dark`}
          id="time"
          name="time"
          type="time"
          required
          aria-invalid={Boolean(fieldErrors.time)}
          aria-describedby={fieldErrors.time ? "time-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="venue"
        label="Venue"
        helperText="Enter the venue name, or use Online for a virtual event."
        errorMessage={fieldErrors.venue}
      >
        <input
          className={controlClasses}
          id="venue"
          name="venue"
          type="text"
          placeholder="The Majestic Downtown, or Online(if event is virtual)"
          required
          aria-invalid={Boolean(fieldErrors.venue)}
          aria-describedby={fieldErrors.venue ? "venue-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="location"
        label="Location"
        helperText="Enter the city for onsite events, meeting link for online, and both for hybrid(i.e Texas, https://zoom.us..)"
        errorMessage={fieldErrors.location}
      >
        <input
          className={controlClasses}
          id="location"
          name="location"
          type="text"
          placeholder="Los Angeles or https://zoom.us...(for virtual events)"
          required
          aria-invalid={ Boolean(fieldErrors.location) }
          aria-describedby={
            fieldErrors.location ? "location-error" : undefined
          }
        />
      </EventFormField>

      <EventFormField
        id="mode"
        label="Event Mode"
        errorMessage={fieldErrors.mode}
        helperText="Select Event Modes: Onsite | Online | Hybrid"
      >
        <div className="relative">
          <select
            className={`${controlClasses} appearance-none pr-10`}
            id="mode"
            name="mode"
            defaultValue="onsite"
            required
            aria-invalid={Boolean(fieldErrors.mode)}
            aria-describedby={fieldErrors.mode ? "mode-error" : undefined}
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
        errorMessage={fieldErrors.image}
      >
        <input
          className="peer sr-only"
          id="image"
          name="image"
          type="file"
          accept="image/*"
          required
          aria-invalid={Boolean(fieldErrors.image)}
          aria-describedby={fieldErrors.image ? "image-error" : undefined}
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

      <EventFormField
        id="audience"
        label="Audience"
        errorMessage={fieldErrors.audience}
      >
        <input
          className={controlClasses}
          id="audience"
          name="audience"
          type="text"
          placeholder="Developers, Designers, DevOps Engineers, etc."
          required
          aria-invalid={Boolean(fieldErrors.audience)}
          aria-describedby={fieldErrors.audience ? "audience-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="organizer"
        label="Organizer"
        helperText="Enter the name and a brief introduction of the event organizer."
        errorMessage={fieldErrors.organizer}
      >
        <input
          className={controlClasses}
          id="organizer"
          name="organizer"
          type="text"
          placeholder="GitHub - the world’s largest developer platform and a subsidiary of Microsoft."
          required
          aria-invalid={Boolean(fieldErrors.organizer)}
          aria-describedby={fieldErrors.organizer ? "organizer-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="agenda"
        label="Agenda"
        helperText="Put each agenda in a new line"
        errorMessage={fieldErrors.agenda}
      >
        <textarea
          className={`${controlClasses} min-h-28 resize-none leading-[1.7]`}
          id="agenda"
          name="agenda"
          placeholder={`Agenda item 1\nAgenda item 2\nAgenda item 3`}
          required
          aria-invalid={Boolean(fieldErrors.agenda)}
          aria-describedby={fieldErrors.agenda ? "agenda-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="tags"
        label="Tags"
        helperText="Separate each tag with a comma."
        errorMessage={fieldErrors.tags}
      >
        <input
          className={controlClasses}
          id="tags"
          name="tags"
          type="text"
          placeholder="AI, Web, Cloud, DevOps, etc."
          required
          aria-invalid={Boolean(fieldErrors.tags)}
          aria-describedby={fieldErrors.tags ? "tags-error" : undefined}
        />
      </EventFormField>

      <EventFormField
        id="overview"
        label="Event Overview"
        helperText="Give attendees a quick summary (up to 500 characters)."
        errorMessage={fieldErrors.overview}
      >
        <textarea
          className={`${controlClasses} min-h-28 resize-none leading-[1.7]`}
          id="overview"
          name="overview"
          placeholder="Provide a short overview of the event"
          maxLength={500}
          required
          aria-invalid={Boolean(fieldErrors.overview)}
          aria-describedby={
            fieldErrors.overview ? "overview-error" : undefined
          }
        />
      </EventFormField>

      <EventFormField
        id="description"
        label="Event Description"
        helperText="Share more details about the event (up to 1,000 characters)."
        errorMessage={fieldErrors.description}
      >
        <textarea
          className={`${controlClasses} min-h-40 resize-none leading-[1.7]`}
          id="description"
          name="description"
          placeholder="Briefly describe the event"
          maxLength={1000}
          required
          aria-invalid={Boolean(fieldErrors.description)}
          aria-describedby={
            fieldErrors.description ? "description-error" : undefined
          }
        />
      </EventFormField>

      {
        submissionResult && (
          <p
            className={`text-sm ${
              submissionResult.success ? "text-green-300" : "text-red-300"
            }`}
            role={submissionResult.success ? "status" : "alert"}
          >
            {submissionResult.message}
          </p>
        )
      }

      <button
        className="w-full cursor-pointer rounded-md bg-primary px-4 py-3 text-base font-semibold text-black transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        disabled={isSubmitting || submissionResult?.success === true}
        type="submit"
      >
        {
          isSubmitting
            ? 'Saving...'
            : 'Save Event'
        }
      </button>
    </form>
  );
}