"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

//import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function Banner({ profile }: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  console.log(profile)
  return (
    <div className="w-full min-w-full h-48 bg-secondary rounded-2xl hidden md:flex items-center px-20">
      <div className="w-32 h-32 min-w-32 rounded-full mr-12 flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={profile.profileImage?.asset?.url ?? "/defaultAvatar.png"}
            onLoadingStatusChange={(status) => {
              if (status === "loaded") {
                setIsAvatarLoaded(true);
              }
            }}
            className="rounded-full w-32 h-32 object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        {!isAvatarLoaded ? (
          <Skeleton className={`min-h-32 min-w-32 rounded-full bg-light3`} />
        ) : null}
      </div>

      <div>
        <h1 className="text-3xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-2xl font-bold text-primary">
          {profile.jobRole
            ? profile.jobRole.map((role: string, index: number) => (
                <span key={index}>
                  {role}
                  {index < profile.jobRole.length - 1 && ", "}
                </span>
              ))
            : null}
        </h1>
      </div>

      {profile?.team && profile?.team[0]?.company?.companyLogo?.asset.url ? (
        <Image
          src={profile?.team[0]?.company?.companyLogo?.asset.url}
          width={220}
          height={220}
          alt="Company Logo"
          className="ml-auto"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
