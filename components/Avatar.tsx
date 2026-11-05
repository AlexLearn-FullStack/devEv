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
            <span className="flex items-center justify-center size-8 p-3 text-sm text-light-200 border border-dark-200 bg-dark-100 cursor-pointer rounded-full">
              G
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-dark-200 mr-6! rounded">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-center">
                Guest Mode
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-transparent! capitalize">
                <Link href="/sign-in">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-transparent! capitalize">
                <Link href="/sign-up">Sign Up</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-transparent! flex items-center justify-center">
                <span className="text-xs text-light-200 lowercase first-letter:uppercase">
                  Sign up or <span className="capitalize">S</span>ign in to start creating events
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Show>
    </Suspense>
  );
}