"use client";
import { urlFor } from "@/lib/sanity/client";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { SanityDocument } from "next-sanity";
import React, { useEffect } from "react";

export default function PDFBanner({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  // Add a print-specific style to the document
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
        
        .company-logo {
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

  // Optimize image URL to request a smaller version from Sanity
  const optimizedProfileImageUrl = profile.profileImage
    ? urlFor(profile.profileImage).auto("format").quality(80).url() //.width(96).height(96)
    : "/defaultAvatar.png";

  // Optimize company logo URL if it exists
  const companyLogoUrl =
    profile?.team &&
    urlFor(profile?.team[0]?.company?.companyLogo?.asset.url)
      .auto("format")
      .quality(90)
      .url();

  return (
    <div className={`${className} w-full items-center gap-6`}>
      <div className="min-w-24 min-h-24 rounded-full flex justify-center overflow-hidden">
        <Avatar className="">
          <AvatarImage
            src={optimizedProfileImageUrl}
            className="rounded-full w-24 h-24 object-cover"
            loading="eager" // Prioritize loading
          />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-light1">
          {profile.name.toUpperCase()}
        </h1>
        <h1 className="text-xl font-bold text-primary">
          {profile.jobRole?.map((role: string, index: number) => (
            <span key={index}>
              {role}
              {index < profile.jobRole.length - 1 && ", "}
            </span>
          ))}
        </h1>
      </div>
      {companyLogoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={companyLogoUrl}
          width={150}
          height={150}
          alt="Company Logo"
          className="ml-auto company-logo w-[150px]"
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
