"use client";
import Image from "next/image";

import { PiDiamondsFour } from "react-icons/pi";

import React from "react";
import { SanityDocument } from "next-sanity";

type principle = {
  title: string;
  description: string;
};

function getImage(archetype: string): string {
  return `/archetypeImages/${archetype}.png`;
}

export default function PDFPrinciplesYouCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const makeFirstWordBold = (text) => {
    const words = text.split(" ");
    return (
      <span>
        <span style={{ fontWeight: "bold" }}>{words[0]}</span>{" "}
        {words.slice(1).join(" ")}
      </span>
    );
  };

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
            PrinciplesYou Archetype&apos;s
          </h1>
        </div>
      </div>
      <div className="flex flex-col mt-4 gap-6">
        {profile.principleYouArchetype.map(
          (principle: principle, index: number) => (
            <div
              className="flex flex-row justify-center items-center h-fit gap-3"
              key={index}
            >
              <div className="h-fit min-w-16">
                <Image
                  src={getImage(principle.title)}
                  alt="Illustration of the WIDGET gears"
                  width={100}
                  height={100}
                />
              </div>
              <div>
                <p className="font-normal">
                  {" "}
                  {makeFirstWordBold(principle.description)}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
