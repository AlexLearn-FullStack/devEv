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
    return { success: false, error: e };
  }
}