"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";
import defaultAvatar from "@/public/images/default-avatar.png";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
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
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";
import { LinkButton } from "@/src/components/custom-ui/link-button";
import { PROFILE_ROUTES, ERROR_MESSAGES } from "@/src/constants/navigation";
import { UserSanity } from "@/src/shared/entities/user.types";

interface AccountDropdownProps {
  userProfileData?: UserSanity;
  className?: string;
}

export default function AccountDropdown({
  userProfileData,
  className = "",
}: AccountDropdownProps) {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  const userProfilePic = defaultAvatar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex flex-row items-center hover:scale-110 duration-200 overflow-hidden ${className}`}
      >
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
        </Avatar>
        {!isAvatarLoaded && (
          <Skeleton className="min-h-7 min-w-7 rounded-full bg-light3" />
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userProfileData?.profile?.uuid ? (
          <DropdownMenuItem asChild>
            <LinkButton
              href={PROFILE_ROUTES.TUG_CARD(userProfileData.profile.uuid)}
              variant="ghost"
              className="w-full justify-start h-auto p-2"
            >
              My TUG Card
            </LinkButton>
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
                <AlertDialogTitle>
                  {ERROR_MESSAGES.MISSING_BASEBALL_CARD}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {ERROR_MESSAGES.NO_PROFILE}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>OK</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <DropdownMenuItem asChild>
          <LinkButton
            href={PROFILE_ROUTES.LOGOUT}
            variant="ghost"
            className="w-full justify-start h-auto p-2 !text-inspireRed hover:!text-inspireRed"
          >
            Sign Out
          </LinkButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
