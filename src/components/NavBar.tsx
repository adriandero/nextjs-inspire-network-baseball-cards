"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import Link from "next/link";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProfileNavBar(): React.JSX.Element {
  const userProfilePic = "/defaultAvatar.png";

  return (
    <div className="w-full h-16 hidden md:flex justify-end items-center justify-self-center px-6">
      <div className="flex space-x-12 text-lg h-full items-center font-medium">
        <Link href={`/profiles`} className="hover:text-primary duration-200">
          Dashboard
        </Link>
        {/* {<h1 className="hover:text-primary duration-200">Teams</h1>
        <h1 className="hover:text-primary duration-200">Assessment</h1> */}

        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-row items-center gap-2 hover:scale-110 duration-200">
            {" "}
            <Avatar className="h-full">
              <AvatarImage src={userProfilePic} className="rounded-full h-7" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* {<DropdownMenuItem>Profile</DropdownMenuItem>} */}
            <DropdownMenuItem
              className="text-inspireRed hover:!text-inspireRed"
              onClick={() => signOut()}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
