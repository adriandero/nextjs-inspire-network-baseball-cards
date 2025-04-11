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
import MobileNavMenu from "./MobileNavMenu";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function NavBar({
  userProfileData,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = "/defaultAvatar.png";

  function accountHasProfileAssigned() {
    if (userProfileData?.profile) return true;
    return false;
  }

  function handleProfileRedirect() {
    if (accountHasProfileAssigned()) {
      redirect("/profiles/" + userProfileData?.profile.uuid);
    }
  }

  return (
    <>
      <div className="w-full h-16 flex justify-end items-center justify-self-center px-2 sm:px-6">
        <MobileNavMenu
          userProfileData={userProfileData?.profile}
          className="sm:hidden !text-dark1"
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
        <div className=" hidden sm:flex space-x-12 text-lg h-full items-center font-medium">
          <Link href={`#`} className="opacity-50 disabled">
            Lineup Builder
          </Link>
          <Link href={`/compare`} className="hover:text-primary duration-200">
            Compare
          </Link>
          <Link href={`/teams`} className="hover:text-primary duration-200">
            Teams
          </Link>
          {/* {<h1 className="hover:text-primary duration-200">Teams</h1>
        <h1 className="hover:text-primary duration-200">Assessment</h1> */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row items-center hover:scale-110 duration-200 overflow-hidden">
              <Avatar className="h-full">
                <AvatarImage
                  src={userProfilePic}
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
                  Profile
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
    </>
  );
}
