"use server";

import { auth } from "@clerk/nextjs/server";
import { updateTag } from "next/cache";
import connectDB from "../mongodb";
import { Booking, Event } from "@/database";
import { getUserByClerkId } from "./user.actions";


interface ICreateBooking {
  eventId: string;
  slug: string;
  email: string;
}


export const createBooking = async ({ eventId, slug, email }: ICreateBooking) => {
  try {
    await connectDB();

    const { userId } = await auth();

    let creator: unknown = "Anonymous";

    if (userId) {
      const user = await getUserByClerkId(userId);
      creator = user?._id || "Anonymous";
    }


    await Booking.create({
      eventId, slug, email,
      creator
    });
    updateTag("events");
  
    return { success: true };
  }
  catch (e) {
    console.error('Create booking failed: ',e);
    const isDuplicateBooking =
      (typeof e === "object" && e !== null && "code" in e && e.code === 11000) ||
      String(e).includes("E11000 duplicate key error");

    return {
      success: false,
      error: e,
      message: isDuplicateBooking
        ? "Looks like you've already signed up for the event"
        : "Event sign up failed. Please try again later",
    };
  }
}


export const getEventBookingCount = async (slug: string): Promise<number> => {
  try {
    await connectDB();

    const event = await Event.findOne({ slug }).select("_id");
    if (!event) return 0;

    return await Booking.countDocuments({ eventId: event._id });
  } catch (e) {
    console.error("Get event booking count failed:", e);
    return 0;
  }
};