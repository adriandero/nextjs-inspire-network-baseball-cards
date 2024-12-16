"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { useState } from "react";
import { SanityDocument } from "next-sanity";
import { redirect } from "next/navigation";

export default function NavBar({
  userProfileData,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = "/defaultAvatar.png";

  function handleProfileRedirect() {
    if (userProfileData.profile)
      redirect("/profiles/" + userProfileData.profile.slug);
    else
      alert(
        "You don't have a Baseball Card assigned - Ask an administrator for access"
      );
  }

  return (
    <div className="w-full h-16 hidden md:flex justify-end items-center justify-self-center px-6">
      <div className="flex space-x-12 text-lg h-full items-center font-medium">
        <Link href={`/dasboard`} className="hover:text-primary duration-200">
          Dashboard
        </Link>
        {/* {<h1 className="hover:text-primary duration-200">Teams</h1>
        <h1 className="hover:text-primary duration-200">Assessment</h1> */}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center hover:scale-110 duration-200">
            <Avatar className="h-full">
              <AvatarImage
                src={userProfilePic}
                className="rounded-full h-7"
                onLoadingStatusChange={(status) => {
                  if (status === "loaded") {
                    setIsAvatarLoaded(true);
                  }
                }}
              />
              <AvatarFallback></AvatarFallback>
            </Avatar>{" "}
            {!isAvatarLoaded ? (
              <Skeleton className={`min-h-7 min-w-7 rounded-full bg-light3`} />
            ) : null}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleProfileRedirect()}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-inspireRed hover:!text-inspireRed"
              onClick={() => redirect("auth/logout")}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
