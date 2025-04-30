"use client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Sheet, SheetTrigger, SheetContent } from "./ui/sheet";
import { FiMenu } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { SanityDocument } from "next-sanity";
import { redirect } from "next/navigation";
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

export default function MobileNavMenu({
  userProfileData,
  className,
}: SanityDocument): React.JSX.Element {
  const userProfilePic = "/defaultAvatar.png";

  function handleProfileRedirect() {
    if (userProfileData) redirect("/profiles/" + userProfileData.uuid);
    // else
    //   alert(
    //     "You don't have a Baseball Card assigned - Ask an administrator for access"
    //   );
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <FiMenu
          size={32}
          strokeWidth="1.5"
          className={`text-white w-fit ml-4 !min-h-8 !min-w-8   hover:text-primary duration-200 cursor-pointer ${className}`}
        />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-fit w-full items-center border-b px-4 py-2">
            <Collapsible className="grid gap-2 w-full">
              <CollapsibleTrigger className="flex w-full justify-between rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&[data-state=open]>svg]:rotate-90">
                <div className="flex gap-4 overflow-hidden">
                  My Account
                  <Avatar className="h-full">
                    <AvatarImage
                      src={userProfilePic}
                      className="rounded-full h-7 w-7 object-cover"
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </div>
                <ChevronRight className="h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-l ml-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Link
                        href="#"
                        className="group grid h-auto w-full items-center justify-start gap-1 rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent  focus:text-accent-foreground"
                        prefetch={false}
                        onClick={() => handleProfileRedirect()}
                      >
                        Profile
                      </Link>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Missing Baseballcard
                        </AlertDialogTitle>
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
                  <Link
                    href="#"
                    className="group grid h-auto w-full text-inspireRed items-center justify-start gap-1 rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent focus:bg-accent "
                    prefetch={false}
                    onClick={() => redirect("/auth/logout")}
                  >
                    Sign Out
                  </Link>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-base font-medium">
              <Link
                href="/teams"
                className="flex w-full items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                prefetch={false}
              >
                Teams
              </Link>
              <Link
                href="/compare"
                className="flex w-full items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                prefetch={false}
              >
                Compare
              </Link>
              <Link
                href="/lineupbuilder"
                className="flex w-full items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                prefetch={false}
              >
                Lineup Builder
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
