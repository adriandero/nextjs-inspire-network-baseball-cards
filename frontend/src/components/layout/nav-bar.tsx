"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import Link from "next/link";
import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import defaultAvatar from "@/public/images/default-avatar.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";
import { useState } from "react";
import { SanityDocument } from "next-sanity";
import { redirect } from "next/navigation";
import MobileNavMenu from "./mobile-nav-menu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/shadcn-ui/alert-dialog";

export default function NavBar({
  userProfileData,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = defaultAvatar;

  function accountHasProfileAssigned() {
    if (userProfileData?.profile) return true;
    return false;
  }

  function handleProfileRedirect() {
    if (accountHasProfileAssigned()) {
      redirect("/tugcards/" + userProfileData?.profile.uuid);
    }
  }

  return (
    <>
      <div className="w-full h-16 flex items-center justify-self-center px-2 sm:px-6">
        <Link href="/" className="mr-auto">
          <Image
            src={INTMLogo}
            width={70}
            height={150}
            alt="Company Logo"
            className=""
          />
        </Link>

        <MobileNavMenu
          userProfileData={userProfileData?.profile}
          className="md:hidden !text-dark1"
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <div className=" hidden md:flex space-x-12 text-lg h-full items-center font-medium">
          <Link
            href={`https://www.inspirenetworkllc.com/`}
            className="hover:text-primary duration-200"
          >
            About us
          </Link>

          <Link
            href={`/deckbuilder`}
            className="hover:text-primary duration-200"
          >
            Deck Builder
          </Link>
          <Link href={`/browse`} className="hover:text-primary duration-200">
            Browse Cards
          </Link>
          <Link href={`/`} className="hover:text-primary duration-200">
            Home
          </Link>
          {/* {<h1 className="hover:text-primary duration-200">Teams</h1>
        <h1 className="hover:text-primary duration-200">Assessment</h1> */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center hover:scale-110 duration-200 overflow-hidden">
              <Avatar className="h-full">
                <AvatarImage
                  src={userProfilePic.src}
                  className="rounded-full h-7 w-7 object-cover"
                  onLoadingStatusChange={(status) => {
                    if (status === "loaded") {
                      setIsAvatarLoaded(true);
                    }
                  }}
                />
                <AvatarFallback></AvatarFallback>
              </Avatar>{" "}
              {!isAvatarLoaded ? (
                <Skeleton
                  className={`min-h-7 min-w-7 rounded-full bg-light3`}
                />
              ) : null}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {accountHasProfileAssigned() ? (
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => handleProfileRedirect()}
                >
                  My TUG Card
                </DropdownMenuItem>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      My TUG Card
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Missing Baseballcard</AlertDialogTitle>
                      <AlertDialogDescription>
                        You don&apos;t have a TUG Card assigned - Ask an
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
    </>
  );
}
