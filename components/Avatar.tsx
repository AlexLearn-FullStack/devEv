"use client";

import Link from "next/link";
import { Suspense } from "react";
import { Show } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


export default function Avatar () {
  
  return (
    <Suspense>
      <Show when="signed-out">
        <DropdownMenu modal>
          <DropdownMenuTrigger asChild>
            <span
              className="flex items-center justify-center size-8 p-3 text-sm text-light-200 border border-dark-200 bg-dark-100 cursor-pointer rounded-full"
              role="button"
              tabIndex={0}
              aria-label="Guest avatar"
            >
              G
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-dark-200 mr-6! rounded">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-center">
                Guest Mode
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-transparent! focus-within:bg-transparent! hover:text-light-200! focus-within:text-light-200! capitalize" asChild>
                <Link href="/sign-in" className="text-light-100/80! mb-3">
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-transparent! focus-within:bg-transparent! hover:text-light-200! focus-within:text-light-200! capitalize" asChild>
                <Link href="/sign-up" className="text-light-100/80! mb-3">
                  Sign Up
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <span className="text-xs text-light-200">
                Sign up or Sign in to start creating events
              </span>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Show>
    </Suspense>
  );
}