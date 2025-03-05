"use client";
import Image from "next/image";

import { PiDiamondsFour } from "react-icons/pi";

import React from "react";
import { SanityDocument } from "next-sanity";

function getImage(archetype: string): string {
  return `/archetypeImages/${archetype}.png`;
}
import principlesYouJson from "../../../public/principlesYou.json";

export default function PDFPrinciplesYouCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const formatPrincipleContent = (title: string, description: string) => {
    const cleanDescription = description.startsWith(title)
      ? description.substring(title.length + 1).trim()
      : description;

    return (
      <>
        <span className="font-bold">{title}s </span>
        {cleanDescription}
      </>
    );
  };

  type PrincipleKey = keyof typeof principlesYouJson;

  return (
    <div className={`${className} flex flex-col`}>
      <div className="flex flex-row w-full">
        <div className="flex flex-row items-center w-fit h-fit">
          <PiDiamondsFour
            strokeWidth={0.5}
            size={24}
            className="flex self-start mt-0.5"
          />{" "}
          <h1 className="text-lg font-bold flex-grow w-fit ml-6">
            PrinciplesYou Archetypes
          </h1>
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-6">
        {profile.principleYouArchetype.map(
          (principle: PrincipleKey, index: number) => (
            <div
              className="flex flex-row justify-center items-start h-fit gap-3"
              key={index}
            >
              <div className="w-16 min-w-16">
                <Image
                  src={getImage(principle)}
                  alt="Illustration of the WIDGET gears"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p className="font-normal">
                  {formatPrincipleContent(
                    principlesYouJson[principle]?.title,
                    principlesYouJson[principle]?.description
                  )}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
