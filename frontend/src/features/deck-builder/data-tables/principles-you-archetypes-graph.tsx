"use client";

import React from "react";
import { Profile } from "@/src/lib/entities/profile";
import { PRINCIPLES_YOU_ARCHETYPES } from "@/src/features/deck-builder/constants/principles-you-archetypes";
import { Badge } from "@/src/components/shadcn-ui/badge";
import { shortNamesOfProfiles } from "@/src/lib/utils/profile-table-utils";
import Image from "next/image";
import {
  getMetaArchetypeImage,
} from "@/src/lib/asset-mapping/principle-you-archetype-images-mapping";

export interface principlesYouArchetypesGraphProps {
  profiles: Profile[];
  optimizedImages?: boolean;
  tableName?: string;
  breakUpGraph?: boolean;
}

const PrinciplesYouArchetypesGraph: React.FC<
  principlesYouArchetypesGraphProps
> = ({ profiles, tableName }) => {
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
    return shortNamesOfProfiles(profiles).filter((profile) =>
      profile.principleYouArchetype?.includes(archetypeId),
    );
  };

  return (
    <div className="space-y-4 mb-4">
      <h2 className="text-base font-semibold">{tableName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRINCIPLES_YOU_ARCHETYPES.map((group) => (
          <div
            key={group.category}
            className={
              "w-full h-full border border-light3 bg-background sm:rounded-2xl pb-2 pt-2 px-6 "
            }
          >
            <div className="flex flex-row items-end gap-4">
              <Image
                src={getMetaArchetypeImage(group.category.toLowerCase())}
                alt={`Illustration for ${group.category}`}
                layout="intrinsic"
                className="max-h-14 h-full w-auto"
              />

              <h3 className="font-bold text-2xl">{group.category}</h3>
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
                    archetype.id,
                  );

                  return (
                    <div key={archetype.id}>
                      <h4 className="text-gray-600 my-3 text-tertiary text-xl font-bold">
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
                              className={`text-base font-bold ${
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
