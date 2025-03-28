"use client";
import { GoInfo, GoPeople } from "react-icons/go";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
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
} from "../ui/alert-dialog";

export default function MoreProfilesCard({
  moreProfiles,
  currentProfile,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  function handleProfileRedirect(uuid: string): void {
    redirect(`/profiles/${uuid}`);
  }

  return (
    <ComponentShell className="w-full mt-0 overflow-y-scroll">
      <div className="flex flex-row items-center w-full h-fit bg-background">
        <GoPeople strokeWidth={1} size={24} />
        <h1 className="text-xl font-bold flex-grow w-fit ml-6">The Team</h1>
      </div>

      {moreProfiles?.length > 1 ? (
        moreProfiles.map((profile: SanityDocument, index: number) => {
          if (currentProfile?.uuid != profile.uuid) {
            return (
              <div className="pt-6" key={index}>
                <div onClick={() => handleProfileRedirect(profile?.uuid)}>
                  <div className="flex flex-row items-center gap-4 cursor-pointer overflow-hidden">
                    <Avatar className="block w-12 h-12 min-w-12 rounded-full ">
                      <AvatarImage
                        src={
                          profile.profileImage?.asset?.url ??
                          "/defaultAvatar.png"
                        }
                        onLoadingStatusChange={(status) => {
                          if (status === "loaded") {
                            setIsAvatarLoaded(true);
                          }
                        }}
                        className="rounded-full w-12 h-12 object-cover"
                      />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    {!isAvatarLoaded ? (
                      <Skeleton
                        className={`min-h-[50px] min-w-[50px] rounded-full bg-light3`}
                      />
                    ) : null}
                    <div>
                      <p className="font-bold ">{profile?.name}</p>
                      <p>
                        {profile?.jobRole?.map(
                          (role: string, index: number) => (
                            <span key={index}>
                              {role ?? null}
                              {index < profile.jobRole.length - 1 && ", "}
                            </span>
                          )
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <p className="flex italic pt-6 justify-center text-dark3 gap-2">
          No Results.
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <GoInfo className="flex self-center cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>No Team Members Found</AlertDialogTitle>
                <AlertDialogDescription>
                  The profile is either in a team by itself, or you don&apos;t
                  have permissions to view the teams profiles. Ask an
                  administrator for access.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>OK</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </p>
      )}
    </ComponentShell>
  );
}
