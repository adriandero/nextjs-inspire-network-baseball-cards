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
    const wordCount = title.trim().split(/\s+/).length;
    const words = description.trim().split(/\s+/);
    const numWordsToBold = Math.min(wordCount, words.length);

    return (
      <>
        {words.map((word, index) => (
          <React.Fragment key={index}>
            {index > 0 && " "}
            {index < numWordsToBold ? (
              <span className="font-bold">{word}</span>
            ) : (
              word
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  type PrincipleKey = keyof typeof principlesYouJson;

  return (
    <>
      {profile.principleYouArchetype ? (
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
          <div className="flex flex-col mt-4 gap-4">
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
                    <p className="font-normal text-base">
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
      ) : null}
    </>
  );
}
