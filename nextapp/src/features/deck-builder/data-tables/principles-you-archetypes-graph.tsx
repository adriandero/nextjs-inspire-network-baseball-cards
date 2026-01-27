"use client";

import React from "react";
import { Profile } from "@/src/shared/entities/profile.types";
import { PRINCIPLES_YOU_ARCHETYPES } from "@/src/features/deck-builder/constants/principles-you-archetypes";
import { Badge } from "@/src/components/shadcn-ui/badge";
import { shortNamesOfProfiles } from "@/src/lib/utils/profile-table-utils";
import Image from "next/image";
import { getMetaArchetypeImage } from "@/src/lib/utils/principle-you-archetype-images-mapping.helper";

export interface principlesYouArchetypesGraphProps {
  profiles: Profile[];
  optimizedImages?: boolean;
  tableName?: string;
  baseFontSize?: string;
  headingFontSize?: string;
  titleFonteSize?: string;
  showPrimaryOnly?: boolean;
}

const PrinciplesYouArchetypesGraph: React.FC<
  principlesYouArchetypesGraphProps
> = ({
  profiles,
  tableName,
  showPrimaryOnly,
  baseFontSize = "text-base",
  headingFontSize = "text-xl",
  titleFonteSize = "text-2xl",
}) => {
  if (profiles.length === 0) {
    return (
      <div>
        <h2 className="text-base font-semibold">{tableName}</h2>
        <div className="py-4">
          <p className="text-gray-500">No profiles to display</p>
        </div>
      </div>
    );
  }

  const getProfilesForArchetype = (archetypeId: string) => {
    const filteredProfiles = shortNamesOfProfiles(profiles).filter(
      (profile) => {
        const hasArchetype =
          profile.principleYouArchetype?.includes(archetypeId);

        if (showPrimaryOnly) {
          return profile.principleYouArchetype?.[0] === archetypeId;
        }

        return hasArchetype;
      }
    );

    return filteredProfiles;
  };

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-base font-semibold">{tableName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
        {PRINCIPLES_YOU_ARCHETYPES.map((group) => (
          <div
            key={group.category}
            className={
              "w-full h-full border border-light3 bg-background sm:rounded-2xl pb-4 pt-2 px-6 break-inside-avoid"
            }
          >
            <div className="flex flex-row items-end gap-4 ">
              <Image
                src={getMetaArchetypeImage(group.category.toLowerCase())}
                alt={`Illustration for ${group.category}`}
                width={64}
                height={64}
                className="h-auto w-auto max-h-18 object-contain"
              />
              <h3 className={`font-bold ${titleFonteSize}`}>
                {group.category}
              </h3>
            </div>
            {group.category === "Individualist" ? (
              <div className="space-y-1">
                {getProfilesForArchetype("individualist").map((profile) => (
                  <div key={profile._id} className="text-xs text-gray-700">
                    {profile.name}
                  </div>
                ))}
              </div>
            ) : (
              <div className="">
                {group.archetypes.map((archetype) => {
                  const archetypeProfiles = getProfilesForArchetype(
                    archetype.id
                  );

                  return (
                    <div key={archetype.id} className={"mt-3"}>
                      <h4
                        className={`text-tertiary mb-2 ${headingFontSize} font-bold`}
                      >
                        {archetype.label}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {archetypeProfiles.map((profile) => {
                          const isPrimaryArchetype =
                            profile.principleYouArchetype?.[0] === archetype.id;

                          return (
                            <Badge
                              variant="outline"
                              key={profile._id}
                              className={`${baseFontSize} font-bold ${
                                isPrimaryArchetype ? "text-inspireMaroon " : ""
                              }`}
                            >
                              {profile.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrinciplesYouArchetypesGraph;
