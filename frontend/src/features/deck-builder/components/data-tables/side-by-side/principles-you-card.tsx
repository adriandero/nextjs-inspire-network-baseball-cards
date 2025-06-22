import { SanityDocument } from "next-sanity";

import { PiDiamondsFour } from "react-icons/pi";
import principlesYouJson from "@/public/json/principles-you-archetypes.json";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/shadcn-ui/radio-group";
import Image from "next/image";
import { getArchetypeImage } from "@/src/lib/asset-mapping/principle-you-archetype-images-mapping";
import React from "react";

export default function PrinciplesYouCard({
  profile,
}: SanityDocument): React.JSX.Element {
  const [value, setValue] = React.useState<PrincipleKey>(
    profile?.principleYouArchetype?.[0] ? profile.principleYouArchetype[0] : {},
  );

  type PrincipleKey = keyof typeof principlesYouJson;

  return (
    <div className="w-full h-fit border border-light3 bg-background rounded-2xl p-4 ">
      <div className="flex flex-row w-full">
        <div className="flex flex-row items-center w-fit h-fit">
          <PiDiamondsFour strokeWidth={0.5} size={24} className="mr-4" />{" "}
          <h1 className="text-lg font-bold flex-grow w-fit">
            PrinciplesYou Archetypes
          </h1>
        </div>
      </div>
      {principlesYouJson[value] ? (
        <div className="flex flex-col mt-4 ">
          <RadioGroup
            value={value}
            onValueChange={(val: PrincipleKey) => setValue(val)}
            className="flex flex-row gap-5 justify-center"
          >
            {profile.principleYouArchetype.map(
              (principle: string, index: number) => (
                <RadioGroupItem key={index} value={principle}>
                  <div className="h-fit w-auto">
                    <Image
                      src={getArchetypeImage(principle)}
                      alt={`Illustration for ${principle}`}
                      layout="intrinsic"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                </RadioGroupItem>
              ),
            )}
          </RadioGroup>
          <div>
            <h3 className="font-bold text-base mt-2">
              {principlesYouJson[value]?.title}
            </h3>
            <p className="font-normal text-sm">
              {" "}
              {principlesYouJson[value]?.description}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex w-full italic text-dark3 mt-2">
          <p className="ml-10">No Result.</p>
        </div>
      )}
    </div>
  );
}
