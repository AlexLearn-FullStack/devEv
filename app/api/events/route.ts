/** biome-ignore-all lint/suspicious/noImplicitAnyLet: declared this way for validation */
import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb";
import { Event } from "@/database";
import { getUserByClerkId } from "@/lib/actions/user.actions";


export async function POST (req: NextRequest) {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    const user = await getUserByClerkId(userId);

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

    let tags: unknown;
    let agenda: unknown;
    try {
      tags = JSON.parse(String(formData.get("tags")));
      agenda = JSON.parse(String(formData.get("agenda")));
    } catch {
      return NextResponse.json(
        { message: "tags and agenda must be valid JSON arrays" },
        { status: 400 },
      );
    }

    const file = formData.get('image');
    if (!(file instanceof File))
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
      creator: user?._id,
    });
    revalidateTag("events", "max");

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
      { message: "Event fetching failed", error: e, events: {} },
      { status: 500 }
    );
  }
}