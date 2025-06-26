"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Image from "next/image";
import { SanityDocument } from "next-sanity";
import { Skeleton } from "@/src/components/shadcn-ui/skeleton";
import { useEffect, useRef, useState } from "react";
import defaultAvatar from "@/public/images/default-avatar.png";
import ameripriseCompass from "@/public/images/ameriprise-compass.png"

export default function Banner({ profile }: SanityDocument): React.JSX.Element {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);

  const profileTeamName = profile?.team?.[0]?.name;

  useEffect(() => {
    if (h1Ref.current) {
      const lineHeight = parseInt(
        getComputedStyle(h1Ref.current).lineHeight,
        10
      );
      setIsMultiLine(h1Ref.current.scrollHeight > lineHeight);
    }
  }, [profileTeamName]);

  console.log(profile);
  return (
    <div className="w-full min-w-full min-h-32 max-h-32 bg-secondary rounded-2xl hidden md:flex items-center gap-8 px-8 py-4">
      <div className="w-24 h-24 min-w-24 min-h-24 rounded-full flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={profile.profileImage?.asset?.url ?? defaultAvatar.src}
            onLoadingStatusChange={(status) => {
              if (status === "loaded") {
                setIsAvatarLoaded(true);
              }
            }}
            className="rounded-full w-24 h-24 object-cover"
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
        <div className="ml-auto flex flex-col items-center max-h-32 max-w-64 min-w-24">
          <Image
            src={ameripriseCompass.src}
            width={100}
            height={100}
            alt="Company Logo"
            className="rounded-md max-h-12 max-w-12 w-12 h-12"
          />
          <h1
            className={`text-center text-light1 text-xl italic font-semibold ${isMultiLine ? "leading-tight" : ""}`}
          >
            {profile?.team && profile?.team[0]?.name}
          </h1>
        </div>
      ) : profile?.team && profile?.team[0]?.teamLogo?.asset.url ? (
        <Image
          src={profile?.team[0]?.teamLogo?.asset.url}
          width={180}
          height={180}
          alt="Company Logo"
          className="ml-auto rounded-md max-h-28"
        />
      ) : (
        <></>
      )}
    </div>
  );
}
