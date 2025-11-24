"use client";

import React, { useEffect, useState } from "react";
import { SanityDocument } from "next-sanity";

import Banner from "@/src/features/deck-builder/components/data-tables/side-by-side/banner";
import ValuesCard from "@/src/features/deck-builder/components/data-tables/side-by-side/values-card";
import WorkingGeniusCard from "@/src/features/deck-builder/components/data-tables/side-by-side/working-genius-card";
import PrinciplesYouCard from "@/src/features/deck-builder/components/data-tables/side-by-side/principles-you-card";
import KolbeStrengthsCard from "@/src/features/deck-builder/components/data-tables/side-by-side/kolbe-strengths-card";

export interface SideBySideProps {
  readonly profiles: SanityDocument[];
  readonly tableName?: string;
  readonly showJobRole?: boolean;
  readonly columnCount?: number;
}

const useColumnCount = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width >= 1024) setColumns(3);
      else if (width >= 640) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  return columns;
};

const chunkProfiles = (
  profiles: SanityDocument[],
  size: number
): SanityDocument[][] => {
  const chunks: SanityDocument[][] = [];
  for (let i = 0; i < profiles.length; i += size) {
    chunks.push(profiles.slice(i, i + size));
  }
  return chunks;
};

const SideBySide: React.FC<SideBySideProps> = ({
  profiles,
  tableName,
  showJobRole,
  columnCount,
}) => {
  const responsiveColumns = useColumnCount();
  const columns = columnCount ?? responsiveColumns;

  const profileGroups = chunkProfiles(profiles, columns);

  if (profiles.length === 0) {
    return (
      <div>
        <h2 className="text-base font-semibold">{tableName}</h2>
        <div className="py-4">
          <p className="text-gray-500">No TUG Cards to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <h2 className="text-base font-semibold mb-4">{tableName}</h2>

      {profileGroups.map((group, groupIdx) => (
        <div
          key={groupIdx}
          className={`${groupIdx !== 0 ? "break-inside-avoid break" : ""} space-y-4 mb-12`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {group.map((profile) => (
              <div key={profile._id} className="flex-1">
                <Banner
                  profile={profile}
                  showJobRole={showJobRole}
                  _id={""}
                  _rev={""}
                  _type={""}
                  _createdAt={""}
                  _updatedAt={""}
                />
              </div>
            ))}
            {Array.from({ length: columns - group.length }).map((_, i) => (
              <div key={`banner-empty-${i}`} className="flex-1" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 break-inside-avoid">
            {group.map((profile) => (
              <div key={profile._id} className="flex-1">
                <ValuesCard
                  profile={profile}
                  _id={""}
                  _rev={""}
                  _type={""}
                  _createdAt={""}
                  _updatedAt={""}
                />
              </div>
            ))}{" "}
            {Array.from({ length: columns - group.length }).map((_, i) => (
              <div key={`banner-empty-${i}`} className="flex-1" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 break-inside-avoid">
            {group.map((profile) => (
              <div key={profile._id} className="flex-1">
                <WorkingGeniusCard
                  profile={profile}
                  _id={""}
                  _rev={""}
                  _type={""}
                  _createdAt={""}
                  _updatedAt={""}
                />
              </div>
            ))}{" "}
            {Array.from({ length: columns - group.length }).map((_, i) => (
              <div key={`banner-empty-${i}`} className="flex-1" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 break-inside-avoid">
            {group.map((profile) => (
              <div key={profile._id} className="flex-1">
                <PrinciplesYouCard
                  profile={profile}
                  _id={""}
                  _rev={""}
                  _type={""}
                  _createdAt={""}
                  _updatedAt={""}
                />
              </div>
            ))}{" "}
            {Array.from({ length: columns - group.length }).map((_, i) => (
              <div key={`banner-empty-${i}`} className="flex-1" />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 break-inside-avoid">
            {group.map((profile) => (
              <div key={profile._id} className="flex-1">
                <KolbeStrengthsCard
                  profile={profile}
                  _id={""}
                  _rev={""}
                  _type={""}
                  _createdAt={""}
                  _updatedAt={""}
                />
              </div>
            ))}{" "}
            {Array.from({ length: columns - group.length }).map((_, i) => (
              <div key={`banner-empty-${i}`} className="flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideBySide;
