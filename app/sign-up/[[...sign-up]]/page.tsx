import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";


export default function Signup() {
  return (
    <Suspense>
      <section
        className="flex w-full items-center justify-center"
      >
        <SignUp
          appearance={clerkAppearance}
          fallbackRedirectUrl="/"
          signInUrl="/sign-in"
        />
      </section>
    </Suspense>
  );
}