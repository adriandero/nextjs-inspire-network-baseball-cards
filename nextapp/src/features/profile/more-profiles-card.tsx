"use client";
import { GoInfo, GoPeople } from "react-icons/go";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import defaultAvatar from "@/public/images/default-avatar.png";

import { SanityDocument } from "next-sanity";
import ComponentShell from "../../components/custom-ui/component-shell";
import { useState } from "react";
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";
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
} from "@/src/components/shadcn-ui/alert-dialog";
import { Profile } from "@/src/shared/entities/profile";

export default function MoreProfilesCard({
  moreProfiles,
  currentProfile,
}: SanityDocument): React.JSX.Element {
  const [loadedAvatars, setLoadedAvatars] = useState<Set<string>>(new Set());

  const handleAvatarLoad = (uuid: string) => {
    setLoadedAvatars((prev) => new Set(prev).add(uuid));
  };

  function handleProfileRedirect(uuid: string): void {
    redirect(`/tugcards/${uuid}`);
  }
  return (
    <ComponentShell className="w-full mt-0 overflow-y-auto">
      <div className="flex flex-row items-center w-full h-fit bg-background">
        <GoPeople strokeWidth={1} size={24} />
        <h1 className="text-xl font-bold flex-grow w-fit ml-6">The Team</h1>
      </div>

      {moreProfiles?.length > 0 ? (
        moreProfiles.map((profile: Profile, index: number) => {
          if (currentProfile?.uuid !== profile.uuid) {
            const isLoaded = loadedAvatars.has(profile.uuid);

            return (
              <div className="pt-6" key={index}>
                <div
                  onClick={() => handleProfileRedirect(profile?.uuid)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex flex-row items-center gap-4">
                    {/* Fixed size container to prevent layout shift */}
                    <div className="relative w-12 h-12 min-w-12 rounded-full">
                      {!isLoaded && (
                        <Skeleton className="absolute inset-0 rounded-full bg-light3" />
                      )}
                      <Avatar
                        className={`w-12 h-12 rounded-full ${!isLoaded ? "opacity-0" : "opacity-100"} transition-opacity`}
                      >
                        <AvatarImage
                          src={profile.avatar?.asset?.url ?? defaultAvatar.src}
                          onLoadingStatusChange={(status) => {
                            if (status === "loaded") {
                              handleAvatarLoad(profile.uuid);
                            }
                          }}
                          className="rounded-full w-12 h-12 object-cover"
                        />
                        <AvatarFallback>
                          {profile.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{profile?.name}</p>
                      <p className="text-sm text-gray-600 truncate">
                        {profile?.jobRole?.join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })
      ) : (
        <p className="flex italic pt-6 justify-center text-dark3 gap-2">
          No Results.
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="inline-flex" aria-label="More information">
                <GoInfo className="flex self-center" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>No Team Members Found</AlertDialogTitle>
                <AlertDialogDescription>
                  The TUG Card is either in a team by itself, or you don&apos;t
                  have permissions to view the teams TUG Cards. Ask an
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
