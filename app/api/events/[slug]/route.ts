/** biome-ignore-all lint/correctness/noUnusedFunctionParameters: needed */
import { NextResponse } from "next/server";
import type { NextRequest, NextResponse as NextRes } from "next/server";
import connectDB from "@/lib/mongodb";
import { Event, type IEvent } from "@/database";


type RouteParams = {
  params: Promise<{
    slug: string
  }>;
};


export async function GET (
  req: NextRequest,
  { params }: RouteParams
): Promise<NextRes> {
  try {
    await connectDB();

    const { slug } = await params;

    if (
      !slug || typeof slug !== 'string'
      || slug.trim() === ''
    ) {
      return NextResponse.json(
        { message: 'Invalid or missing slug parameter' },
        { status: 400 }
      );
    }

    const sanitizedSlug = slug.trim().toLowerCase();

    const event: IEvent | null = await Event
      .findOne({ slug: sanitizedSlug })
      .lean();
    
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug: ${sanitizedSlug} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Event fetched successfully', event },
      { status: 200 }
    )
  }
  catch (e) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error fetching event by slug: ${e}`);
    }

    if (e instanceof Error) {
      if (e.message.includes('MONGODB_URI')) {
        return NextResponse.json(
          { message: 'Database configuration error' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'Failed to fetch event', error: e.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'An unexpected error occured' },
      { status: 500 }
    );
  
  }
}