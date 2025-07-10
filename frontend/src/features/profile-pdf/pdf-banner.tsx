/* eslint-disable @next/next/no-img-element */
"use client";
import { urlFor } from "@/src/lib/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { SanityDocument } from "next-sanity";
import React, { useEffect, useRef, useState } from "react";
import defaultAvatar from "@/public/images/default-avatar.png";
import ameripriseCompass from "@/public/images/ameriprise-compass.png";

export default function PdfBanner({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const [isMultiLine, setIsMultiLine] = useState(false);
  const profilesTeamName = profile?.team?.[0]?.name;

  useEffect(() => {
    // This style will only apply when generating PDFs
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        img, svg {
          max-width: 180px !important;
          max-height: 180px !important;
          image-rendering: optimizeSpeed !important;
          transform: translateZ(0);
        }
        
        .team-logo {
          max-width: 150px !important;
          max-height: 150px !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (h1Ref.current) {
      const lineHeight = parseInt(
        getComputedStyle(h1Ref.current).lineHeight,
        10
      );
      setIsMultiLine(h1Ref.current.scrollHeight > lineHeight);
    }
  }, [profilesTeamName]);

  const optimizedProfileImageUrl = profile.profileImage
    ? urlFor(profile.profileImage).auto("format").quality(80).url()
    : defaultAvatar.src;

  const teamLogoUrl = profile?.team[0]?.teamLogo
    ? urlFor(profile?.team[0]?.teamLogo?.asset.url)
        .auto("format")
        .quality(90)
        .url()
    : null;

  return (
    <div className={`${className} w-full items-center gap-4`}>
      <div className="min-w-20 min-h-20 max-h-20 rounded-full flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={optimizedProfileImageUrl}
            className="rounded-full w-20 h-20 object-cover"
            loading="eager"
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-lg font-bold text-primary">
          {profile.jobRole?.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profile.jobRole?.length - 1 && ", "}
            </span>
          ))}
        </h1>
      </div>

      {profile?.team && profile?.team[0]?.isameriprise ? (
        <div className="ml-auto flex flex-col items-center max-h-24 min-w-24 max-w-48">
          <img
            src={ameripriseCompass.src}
            width={90}
            height={90}
            alt="Team Logo"
            className=" team-logo rounded-md max-h-10 max-w-10 w-10 h-10"
          />
          <h1
            ref={h1Ref}
            className={`text-center text-light1 italic font-semibold ${
              isMultiLine ? "text-sm" : "text-lg"
            }`}
          >
            {profile?.team && profilesTeamName}
          </h1>
        </div>
      ) : teamLogoUrl ? (
        <img
          src={teamLogoUrl}
          width={110}
          height={110}
          alt="Team Logo"
          className="ml-auto team-logo rounded-lg"
          style={{
            maxWidth: "250px",
            maxHeight: "150px",
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
