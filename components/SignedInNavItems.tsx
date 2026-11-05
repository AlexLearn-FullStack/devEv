"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Show } from "@clerk/nextjs";
import UserBtn from "./UserBtn";


export default function SignedInNavItems () {
  
  return (
    <Suspense>
      <Show when="signed-in">
        <Link href="/create">Create Event</Link>

        <UserBtn />
      </Show>
    </Suspense>
  );
}