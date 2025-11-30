"use client";
import Image from "next/image";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/shadcn-ui/radio-group";

import { PiDiamondsFour } from "react-icons/pi";
import principlesYouJson from "@/public/json/principles-you-archetypes.json";

import React from "react";
import { SanityDocument } from "next-sanity";
import ComponentShell from "../../components/custom-ui/component-shell";
import { getArchetypeImage } from "@/src/lib/utils/principle-you-archetype-images-mapping.helper";

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
            PrinciplesYou Archetypes
          </h1>
        </div>
      </div>
      {principlesYouJson[value] ? (
        <div className="flex flex-row mt-4 gap-6">
          <div className="flex flex-row mt-4">
            <RadioGroup
              value={value}
              onValueChange={(val: PrincipleKey) => setValue(val)}
              className={"flex flex-col gap-3"}
            >
              {profile.principleYouArchetype.map(
                (principle: string, index: number) => (
                  <RadioGroupItem key={index} value={principle}>
                    <Image
                      src={getArchetypeImage(principle)}
                      alt={`Illustration for ${principle}`}
                      width={60}
                      height={60}
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
        <div className="flex w-full italic text-dark3 pt-6">
          <p className="ml-10">No Result.</p>
        </div>
      )}
    </ComponentShell>
  );
}
