"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";
import { useState } from "react";
import defaultAvatar from "@/public/images/default-avatar.png";

export default function Banner({
  profile,
  showJobRole = true,
}: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);

  return (
    <div className="w-full flex bg-secondary items-center px-4 py-3 rounded-lg gap-2">
      <div className="w-16 h-16 min-w-16 min-h-16 rounded-full flex justify-center overflow-hidden ">
        <Avatar className="">
          <AvatarImage
            src={profile.avatar?.asset?.url ?? defaultAvatar.src}
            onLoadingStatusChange={(status) => {
              if (status === "loaded") {
                setIsAvatarLoaded(true);
              }
            }}
            className="rounded-full w-16 h-16 object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        {!isAvatarLoaded ? (
          <Skeleton className={`min-h-28 min-w-28 rounded-full bg-light3`} />
        ) : null}
      </div>
      <div>
        <h1 className="text-xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-lg font-bold text-primary">
          {profile.jobRole && showJobRole
            ? profile.jobRole.map((role: string, index: number) => (
                <span key={index}>
                  {role}
                  {index < profile.jobRole.length - 1 && ", "}
                </span>
              ))
            : null}
        </h1>
      </div>
    </div>
  );
}
