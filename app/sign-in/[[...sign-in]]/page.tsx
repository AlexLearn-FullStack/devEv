import { Suspense } from "react";
import { SignIn } from "@clerk/nextjs";
import { clerkAppearance } from "@/lib/clerk-appearance";


export default function Signin() {
  return (
    <Suspense>
      <section
        className="flex w-full items-center justify-center"
      >
        <SignIn
          appearance={clerkAppearance}
          fallbackRedirectUrl="/"
          signUpUrl="/sign-up"
        />
      </section>
    </Suspense>
  );
}