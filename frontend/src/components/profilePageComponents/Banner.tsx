"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "../ui/skeleton";
import { useState } from "react";

export default function Banner({ profile }: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const ameripriseCompass = "/ameriprise-compass.png";
  console.log(profile);
  return (
    <div className="w-full min-w-full min-h-32 max-h-32 bg-secondary rounded-2xl hidden md:flex items-center gap-8 px-8 py-4">
      <div className="w-28 h-28 min-w-28 min-h-28 rounded-full flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={profile.profileImage?.asset?.url ?? "/defaultAvatar.png"}
            onLoadingStatusChange={(status) => {
              if (status === "loaded") {
                setIsAvatarLoaded(true);
              }
            }}
            className="rounded-full w-28 h-28 object-cover"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
        {!isAvatarLoaded ? (
          <Skeleton className={`min-h-28 min-w-28 rounded-full bg-light3`} />
        ) : null}
      </div>
      {/* TODO: instead of min-w to prevent jobRole/name to exceed layout -> calculate method for font textor adjust logo */}
      <div className="min-w-56">
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
      {profile?.team && profile?.team[0]?.isameriprise ? (
        <div className="ml-auto flex flex items-center max-h-32 max-w-64 gap-3">
          <h1 className="text-right text-light1 text-xl italic font-semibold">
            {profile?.team && profile?.team[0]?.name}
          </h1>
          <Image
            src={ameripriseCompass}
            width={120}
            height={120}
            alt="Company Logo"
            className="rounded-md max-h-16 w-fit"
          />
        </div>
      ) : profile?.team && profile?.team[0]?.company?.companyLogo?.asset.url ? (
        <Image
          src={profile?.team[0]?.company?.companyLogo?.asset.url}
          width={180}
          height={180}
          alt="Company Logo"
          className="ml-auto rounded-md"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
