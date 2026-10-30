/** biome-ignore-all lint/correctness/useParseIntRadix: Not needed? */
import { Schema, model, models } from 'mongoose';
import type { Document } from "mongoose";
import { requireDocumentSaveForFieldUpdates } from './model-middleware';


export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    overview: {
      type: String,
      required: [true, 'Overview is required'],
      trim: true,
      maxlength: [500, 'Overview cannot exceed 500 characters'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    mode: {
      type: String,
      required: [true, 'Mode is required'],
      enum: {
        values: ['online', 'offline', 'hybrid'],
        message: 'Mode must be either online, offline, or hybrid',
      },
    },
    audience: {
      type: String,
      required: [true, 'Audience is required'],
      trim: true,
    },
    agenda: {
      type: [String],
      required: [true, 'Agenda is required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one agenda item is required',
      },
    },
    organizer: {
      type: String,
      required: [true, 'Organizer is required'],
      trim: true,
    },
    tags: {
      type: [String],
      required: [true, 'Tags are required'],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: 'At least one tag is required',
      },
    },
  },
  {
    timestamps: true,
  }
);

requireDocumentSaveForFieldUpdates(EventSchema, ['title', 'date', 'time']);

EventSchema.pre('save', async function () {
  const event = this as IEvent;

  if (event.isModified('title') || event.isNew) {
    event.slug = generateSlug(event.title);
  }

  if (event.isModified('date')) {
    event.date = normalizeDate(event.date);
  }

  if (event.isModified('time')) {
    event.time = normalizeTime(event.time);
  }
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/\+/g, ' plus ')
    .replace(/#/g, ' sharp ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDate(dateString: string): string {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ];
  const match = dateString.trim().match(/^([a-z]+)\s+(\d{1,2})(?:\s*-\s*(\d{1,2}))?,\s+(\d{4})$/i);

  if (!match) {
    throw new Error('Invalid date format. Use Month D, YYYY or Month D-D, YYYY (e.g., January 1, 2023)');
  }

  const month = months.indexOf(match[1].toLowerCase());
  if (month === -1) {
    throw new Error('Invalid date format. Use Month D, YYYY or Month D-D, YYYY (e.g., January 1, 2023)');
  }

  const day = Number(match[2]);
  const endDay = match[3] ? Number(match[3]) : day;
  const year = Number(match[4]);
  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31, isLeapYear ? 29 : 28, 31, 30, 31, 30,
    31, 31, 30, 31, 30, 31,
  ];

  if (year === 0 || day < 1 || endDay < day || endDay > daysInMonth[month]) {
    throw new Error('Invalid calendar date');
  }

  const formatDay = (value: number) =>
    `${year.toString().padStart(4, '0')}-${(month + 1).toString().padStart(2, '0')}-${value.toString().padStart(2, '0')}`;
  const startDate = formatDay(day);

  return endDay === day ? startDate : `${startDate} - ${formatDay(endDay)}`;
}

function normalizeTime(timeString: string): string {
  const timeRegex = /^(\d{1,2}):(\d{2})(\s*(AM|PM))?$/i;
  const match = timeString.trim().match(timeRegex);
  
  if (!match) {
    throw new Error('Invalid time format. Use HH:MM or HH:MM AM/PM');
  }
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[4]?.toUpperCase();
  
  if (period) {
    if (hours < 1 || hours > 12) {
      throw new Error('Invalid time values');
    }
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
  }
  
  if (hours < 0 || hours > 23 || parseInt(minutes) < 0 || parseInt(minutes) > 59) {
    throw new Error('Invalid time values');
  }
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
}


EventSchema.index({ slug: 1 }, { unique: true });
EventSchema.index({ date: 1, mode: 1 });


const Event = models.Event || model<IEvent>('Event', EventSchema);
export default Event;