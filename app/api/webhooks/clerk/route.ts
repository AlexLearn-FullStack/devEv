import "dotenv/config";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextResponse, type NextRequest } from "next/server";
import { createUserFromClerk, deleteUser } from "@/lib/actions/user.actions";


export async function POST(request: NextRequest) {
  let event: Awaited<ReturnType<typeof verifyWebhook>>;

  try {
    event = await verifyWebhook(request);
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 },
    );
  }

  try {
    if (
      event.type === "user.created"
        ||
      event.type === "user.updated"
    ) {
      await createUserFromClerk(event.data);
    }

    if (event.type === "user.deleted") {
      const userId = event.data.id;

      if (userId) await deleteUser(userId);
    }

  } catch (error) {
    console.error("Failed to save Clerk user:", error);
    return NextResponse.json(
      { error: "Unable to process Clerk user event" },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
