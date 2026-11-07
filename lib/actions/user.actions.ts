"use server";

import connectDB from "@/lib/mongodb";
import { User } from "@/database";


interface ClerkUserCreatedData {
  id: string;
  email_addresses: Array<{
    id: string;
    email_address: string;
  }>;
  primary_email_address_id: string | null;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
}

export async function createUserFromClerk(
  clerkUser: ClerkUserCreatedData,
): Promise<void> {

  const primaryEmail = clerkUser.email_addresses.find(
    ({ id }) => id === clerkUser.primary_email_address_id,
  )?.email_address;
  const email = primaryEmail ?? clerkUser.email_addresses[0]?.email_address;

  if (!email?.trim()) {
    throw new Error(`Clerk user ${clerkUser.id} has no email address`);
  }

  const displayName =
    [clerkUser.first_name, clerkUser.last_name]
      .filter((name): name is string => Boolean(name?.trim()))
      .join(" ")
      .trim() ||
    clerkUser.username?.trim() ||
    email;

  await connectDB();

  await User.updateOne(
    { clerkId: clerkUser.id },
    {
      $setOnInsert: {
        clerkId: clerkUser.id,
        email,
        displayName,
      },
    },
    { upsert: true, runValidators: true },
  );
}


export async function deleteUser (id: string) {
  try {
    await connectDB();

    if (!id)
      return { success: false };

    await User.findOneAndDelete({ clerkId: id });

    return { success: true };  
  }
  catch (e) {
    console.error(e)
    return {
      success: false,
      message: "Could not delete the user"
    };
  }
}


export async function getUserById (id: string) {
  try {
    await connectDB();

    if (!id)
      return null;

    const user = await User.findById(id);

    return user;  
  }
  catch (e) {
    console.error(e)
    return null;
  }
}

export async function getUserByClerkId (clerkId: string) {
  try {
    await connectDB();

    if (!clerkId)
      return null;

    const user = await User.findOne({ clerkId });

    return user;  
  }
  catch (e) {
    console.error(e)
    return null;
  }
}