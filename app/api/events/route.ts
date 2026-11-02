/** biome-ignore-all lint/suspicious/noImplicitAnyLet: declared this way for validation */
import { NextResponse, type NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";


export async function POST (req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 },
      );
    }

    const tags = JSON.parse(formData.get("tags") as string);
    const agenda = JSON.parse(formData.get("agenda") as string);

    const file = formData.get('image') as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 }
      );

    // Typically when we work with files, we want to get access to the blob
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image', folder: 'DevEv' },
          (error, results) => {
            if (error) return reject(error);

            resolve(results);
          }
        ).end(buffer);
      }
    );

    event.image = (uploadResult as { secure_url: string }).secure_url;

    const createdEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });

    return NextResponse.json(
      {
        message: "Event created successfully",
        event: createdEvent,
      },
      { status: 201 },
    );
  }
  catch (e) {
    console.error(e);
    // How we send data back from an api in Next.js (my own comment, not AI)
    return NextResponse.json(
      {
        message: "Event Creation Failed",
        error: e instanceof Error ? e.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}


export async function GET () {
  try {
    await connectDB();

    const events = await Event.find().sort({ createdAt: -1 });
    
    return NextResponse.json(
      {
        message: "Events fetched successfully",
        events
      },
      { status: 200 }
    );
  }
  catch (e) {
    console.error(e)
    return NextResponse.json(
      { message: "Event fetching failed", error: e },
      { status: 500 }
    );
  }
}