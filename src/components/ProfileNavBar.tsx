"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
//import { useSession } from "next-auth/react";

import Link from "next/link";

import { GoArrowLeft } from "react-icons/go";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { redirect } from "next/navigation";
import { useState } from "react";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "./ui/skeleton";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "./ui/alert-dialog";

export default function ProfileNavBar({
  userProfileData,
}: SanityDocument): React.JSX.Element {
  // const { data: session, status } = useSession();

  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = "/defaultAvatar.png";

  function accountHasProfileAssigned() {
    if (userProfileData) return true;
    return false;
  }

  function handleProfileRedirect() {
    if (accountHasProfileAssigned()) {
      redirect("/profiles/" + userProfileData.slug);
    }
  }

  return (
    <div className="w-full h-16 hidden md:flex justify-between items-center justify-self-center px-6">
      <Link href={`/dashboard/`}>
        <GoArrowLeft
          size={28}
          strokeWidth="0.5"
          className="text-dark1 hover:text-primary hover:scale-110 duration-200"
        />
      </Link>
      <div className="flex space-x-12 text-lg h-full items-center font-medium">
        <Link href={`/dashboard`} className="hover:text-primary duration-200">
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
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {accountHasProfileAssigned() ? (
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <button onClick={() => handleProfileRedirect()}>Profile</button>
              </DropdownMenuItem>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Profile
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Missing Baseballcard</AlertDialogTitle>
                    <AlertDialogDescription>
                      You don&apos;t have a Baseball Card assigned - Ask an
                      administrator for access
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>OK</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

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
