"use client";
import { GoPeople } from "react-icons/go";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { redirect } from "next/navigation";

export default function MoreProfilesCard({
  moreProfiles,
  currentProfile,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  function handleProfileRedirect(profile: SanityDocument): void {
    redirect(`/profiles/${profile.slug.current}`);
  }

  return (
    <ComponentShell className="w-full mt-0">
      <div className="flex flex-row items-center w-fit h-fit">
        <GoPeople strokeWidth={1} size={24} />
        <h1 className="text-xl font-bold flex-grow w-fit ml-6">The Team</h1>
      </div>

      {moreProfiles.length > 0 ? (
        moreProfiles.map((profile: SanityDocument, index: number) => {
          if (
            profile.team.slug.current == currentProfile.team.slug.current &&
            currentProfile.slug.current != profile.slug
          ) {
            return (
              <div className="pt-6" key={index}>
                <div onClick={() => handleProfileRedirect(profile)}>
                  <div className="flex flex-row items-center gap-4 cursor-pointer">
                    <Avatar className="block">
                      <AvatarImage
                        src={
                          profile.profileImage?.asset?.url ??
                          "/defaultAvatar.png"
                        }
                        width={50}
                        height={50}
                        onLoadingStatusChange={(status) => {
                          if (status === "loaded") {
                            setIsAvatarLoaded(true);
                          }
                        }}
                        className="rounded-full"
                      />
                      <AvatarFallback></AvatarFallback>
                    </Avatar>
                    {!isAvatarLoaded ? (
                      <Skeleton
                        className={`min-h-[50px] min-w-[50px] rounded-full bg-light3`}
                      />
                    ) : null}
                    <div>
                      <p className="font-bold ">{profile.name}</p>
                      <p>{profile.jobRole}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <p className="flex italic pt-6 justify-center text-dark3 ">
          No Results.
        </p>
      )}
    </ComponentShell>
  );
}
