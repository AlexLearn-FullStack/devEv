"use client";

import { Suspense } from "react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { BuildingIcon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";


const UserBtn = () => (
  <Suspense fallback={<Skeleton className="size-7 rounded-full" />}>
    <UserButton>
      <UserButton.UserProfilePage
        label="Organizations"
        labelIcon={<BuildingIcon className="size-4" />}
        url="organization"
      >
        <div className="p-4">
          <h2>Manage Organization</h2>
          <OrganizationSwitcher
            hidePersonal
            afterCreateOrganizationUrl={"/"}
            afterSelectOrganizationUrl={"/"}
            appearance={{
              elements: {
                rootBox: "w-full",
              },
            }}
          />
        </div>
      </UserButton.UserProfilePage>
    </UserButton>
  </Suspense>
);


export default UserBtn;