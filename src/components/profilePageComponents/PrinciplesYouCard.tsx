"use client";
import Image from "next/image";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radioGroup";

import { PiDiamondsFour } from "react-icons/pi";

import principleYouIllustration from "@/../public/principleYouIllustraions/coach.png";
import React from "react";
import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";

type principle = {
  title: string;
  description: string;
};

export default function PrinciplesYouCard({
  profile,
}: SanityDocument): React.JSX.Element {
  const [value, setValue] = React.useState<principle>(
    profile?.principleYouArchetype?.[0] ? profile.principleYouArchetype[0] : {}
  );

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
      <div className="flex flex-row mt-4 gap-6">
        <div className="flex flex-row mt-4 gap-6">
          <RadioGroup
            value={JSON.stringify(value)}
            onValueChange={(val) => setValue(JSON.parse(val))}
          >
            {profile.principleYouArchetype.map(
              (principle: principle, index: number) => (
                <RadioGroupItem key={index} value={JSON.stringify(principle)}>
                  <Image
                    src={principleYouIllustration}
                    alt={`${principle.title} illustration`}
                  />
                </RadioGroupItem>
              )
            )}
          </RadioGroup>
        </div>
        <div>
          <h3 className="font-bold text-lg mt-2">
            {value.title}
            {/*<span className="font-normal text-base"> {value.description}</span>*/}
          </h3>
          <p className="font-normal"> {value.description}</p>
        </div>
      </div>
    </ComponentShell>
  );
}
