"use server";

import connectDB from "../mongodb";
import { Booking } from "@/database";


interface ICreateBooking {
  eventId: string;
  slug: string;
  email: string;
}


export const createBooking = async ({ eventId, slug, email }: ICreateBooking) => {
  try {
    await connectDB();

    await Booking.create({ eventId, slug, email });
  
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