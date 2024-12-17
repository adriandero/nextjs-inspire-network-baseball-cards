"use client";
import Image from "next/image";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";

import { PiDiamondsFour } from "react-icons/pi";
import principlesYouJson from "../../../public/principlesYou.json";

import React from "react";
import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";

function getImage(archetype: string): string {
  return `/archetypeImages/${archetype}.png`;
}

export default function PrinciplesYouCard({
  profile,
}: SanityDocument): React.JSX.Element {
  const [value, setValue] = React.useState<PrincipleKey>(
    profile?.principleYouArchetype?.[0] ? profile.principleYouArchetype[0] : {}
  );

  type PrincipleKey = keyof typeof principlesYouJson;

  return (
    <ComponentShell>
      <div className="flex flex-row w-full">
        <div className="flex flex-row items-center w-fit h-fit">
          <PiDiamondsFour
            strokeWidth={0.5}
            size={24}
            className="flex self-start"
          />{" "}
          <h1 className="text-xl font-bold flex-grow w-fit ml-6">
            PrinciplesYou Archetype&apos;s
          </h1>
        </div>
      </div>
      {principlesYouJson[value] ? (
        <div className="flex flex-row mt-4 gap-6">
          <div className="flex flex-row mt-4 gap">
            <RadioGroup
              value={value}
              onValueChange={(val: PrincipleKey) => setValue(val)}
            >
              {profile.principleYouArchetype.map(
                (principle: string, index: number) => (
                  <RadioGroupItem key={index} value={principle}>
                    <Image
                      src={getImage(principle)}
                      alt={`${principle} illustration`}
                      width={100}
                      height={100}
                    />
                  </RadioGroupItem>
                )
              )}
            </RadioGroup>
          </div>
          <div>
            <h3 className="font-bold text-lg mt-2">
              {principlesYouJson[value]?.title}
              {/*<span className="font-normal text-base"> {value.description}</span>*/}
            </h3>
            <p className="font-normal">
              {" "}
              {principlesYouJson[value]?.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center italic text-dark3 pt-6">
          <p>No Result.</p>
        </div>
      )}
    </ComponentShell>
  );
}
