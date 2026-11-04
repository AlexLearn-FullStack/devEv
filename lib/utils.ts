import z from "zod"

export { cn } from "cn"


const MAX_FILE_SIZE = 25 * 1024 * 1024;
const eventModes = ["onsite", "online", "hybrid"] as const;

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: "Title is too short" })
    .max(100, { error: "Title cannot exceed 100 characters!" }),

  description: z
    .string()
    .trim()
    .min(15, { error: "Description is too short" })
    .max(1000, { error: "Description cannot exceed 1000 characters!" }),

  overview: z
    .string()
    .trim()
    .min(10, { error: "Overview is too short" })
    .max(500, { error: "Overview cannot exceed 500 characters!" }),
  
  image: z
    .file()
    .min(1, { error: "Event image cannot be empty" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      { error: "Event Banner size cannot exceed 25MB!" }
    ),

  venue: z
    .string()
    .trim()
    .min(3, { error: "Venue is too short" })
    .max(50, { error: "Venue cannot exceed 50 characters!" }),

  location: z
    .string()
    .trim(),

  mode: z
    .enum(eventModes, {
      error: "Mode must be either online, onsite or hybrid!"
    }),

  audience: z
    .string()
    .trim()
    .min(3, { error: "Audience is too short" })
    .max(50, { error: "Audience cannot exceed 50 characters!" }),

  organizer: z
    .string()
    .trim()
    .min(3, { error: "Organizer is too short" })
    .max(120, { error: "Organizer cannot exceed 120 characters!" }),

  agenda: z
    .string()
    .transform((value) => [
      ...new Set(
        value
          .split("\n")
          .map((agenda) => agenda.trim().toLowerCase())
          .filter(Boolean),
      ),
    ])
    .refine(
      (agenda) => agenda.length > 0,
      { error: "Agenda are required" }
    ),

  tags: z
    .string()
    .transform((value) => [
      ...new Set(
        value
          .split(",")
          .map((tag) => tag.trim().toLowerCase())
          .filter(Boolean),
      ),
    ])
    .refine(
      (tags) => tags.length > 0,
      { error: "Tags are required" }
    ),

  date: z
    .string()
    .refine(
      (date) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date.startsWith("0000")) {
          return false;
        }

        const parsedDate = new Date(`${date}T00:00:00.000Z`);
        return !Number.isNaN(parsedDate.getTime()) &&
          parsedDate.toISOString().slice(0, 10) === date;
      },
      { error: "Enter a valid event date" },
    )
    .transform((date) =>
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${date}T00:00:00.000Z`)),
    ),

  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, {
      error: "Enter a valid event time"
    }),

}).superRefine((event, ctx) => {
  const addLocationError = (message: string) => {
    ctx.addIssue({ code: "custom", path: ["location"], message });
  };
  const isValidMeetingLink = (value: string) => {
    try {
      const url = new URL(value);
      return url.protocol === "https:";
    } catch {
      return false;
    }
  };

  if (event.mode === "onsite") {

    if (event.location.length < 3) {
      addLocationError("Location is too short");

    } else if (event.location.length > 50) {
      addLocationError("Location cannot exceed 50 characters!");

    }
  } else if (event.mode === "online") {

    if (!isValidMeetingLink(event.location)) {
      addLocationError("Please pass a valid virtual event meeting link");

    }

  } else {
    const separator = event.location.lastIndexOf(",");
    const physicalLocation = event.location.slice(0, separator).trim();
    const meetingLink = event.location.slice(separator + 1).trim();

    if (
      separator < 0 ||
      physicalLocation.length < 3 ||
      physicalLocation.length > 50 ||
      !isValidMeetingLink(meetingLink)
    ) {
      addLocationError(
        "For a hybrid event, please pass both the physical location and the meeting link",
      );
    }
  }
});

export type EventField = keyof z.input<typeof eventSchema>;
export type EventFieldErrors = Partial<Record<EventField, string>>;

export type EventSubmissionResult =
  | { success: true; message: string }
  | {
      success: false;
      message: string;
      fieldErrors?: EventFieldErrors;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}


export const handleSubmit = async (
  formData: FormData,
): Promise<EventSubmissionResult> => {
  const parsed = eventSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const fieldErrors: EventFieldErrors = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && field in eventSchema.shape) {
        fieldErrors[field as EventField] ??= issue.message;
      }
    }

    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      fieldErrors,
    };
  }

  const requestData = new FormData();
  for (const [field, value] of Object.entries(parsed.data)) {
    if (value instanceof File) {
      requestData.append(field, value);
    } else if (Array.isArray(value)) {
      requestData.append(field, JSON.stringify(value));
    } else {
      requestData.append(field, value);
    }
  }

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      body: requestData,
    });

    let responseBody: unknown;
    try {
      responseBody = await response.json();
    } catch {
      return {
        success: false,
        message: "The server returned an unreadable response. Please try again.",
      };
    }

    const responseMessage =
      isRecord(responseBody) && typeof responseBody.message === "string"
        ? responseBody.message
        : undefined;

    const responseDetails = JSON.stringify(responseBody).toLowerCase();
    const isDuplicateSlugError =
      responseDetails.includes("e11000") &&
      (responseDetails.includes("slug_1") ||
        responseDetails.includes("duplicate key"));

    if (!response.ok) {
      const duplicateSlugMessage =
        "An event with a similar title already exists. Please tweak the event title; its URL slug is generated automatically.";

      return {
        success: false,
        message: isDuplicateSlugError
          ? duplicateSlugMessage
          : responseMessage ?? `Event creation failed (${response.status}).`,
        ...(isDuplicateSlugError
          ? { fieldErrors: { title: duplicateSlugMessage } }
          : {}),
      };
    }

    return {
      success: true,
      message: responseMessage ?? "Event created successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `Unable to save the event: ${error.message}`
          : "Unable to save the event. Please try again.",
    };
  }
}