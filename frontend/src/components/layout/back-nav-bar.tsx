"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
//import { useSession } from "next-auth/react";

import Link from "next/link";

import { GoArrowLeft } from "react-icons/go";
import defaultAvatar from "@/public/images/default-avatar.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";

import { redirect } from "next/navigation";
import { useState } from "react";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/src/components/shadcn-ui/alert-dialog";

export default function BackNavBar({
  userProfileData,
  backwardsNavigationUrl,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = defaultAvatar.src;

  function handleBack() {
    redirect(backwardsNavigationUrl);
  }

  function accountHasProfileAssigned() {
    if (userProfileData) return true;
    return false;
  }

  function handleProfileRedirect() {
    if (accountHasProfileAssigned()) {
      redirect("/tugcards/" + userProfileData?.profile.uuid);
    }
  }

  return (
    <div className="w-full h-16 hidden md:flex justify-between items-center justify-self-center px-6">
      <GoArrowLeft
        size={28}
        strokeWidth="0.5"
        onClick={() => handleBack()}
        className="text-dark1 hover:text-primary hover:scale-110 duration-200"
      />

      <div className="flex space-x-12 text-lg h-full items-center font-medium">
        <Link href={`/deckbuilder`} className="hover:text-primary duration-200">
          Deck Builder
        </Link>
        <Link href={`/browse`} className="hover:text-primary duration-200">
          Browse Cards
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
                <button onClick={() => handleProfileRedirect()}>
                  My TUG Card
                </button>
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
              onClick={() => redirect("/auth/logout")}
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
