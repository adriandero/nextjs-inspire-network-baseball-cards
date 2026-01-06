"use client";

import React from "react";
import {
  getKolbeMethod,
  getKolbeNumericValue,
  KolbeStrengthField,
} from "@/src/lib/utils";
import { GoTools, GoTab, GoSearch, GoRocket } from "react-icons/go";
import { Profile } from "@/src/shared/entities/profile.types";

export interface KolbeGraphProps {
  readonly profiles: Profile[];
  readonly optimizedImages?: boolean;
  readonly tableName?: string;
  readonly baseFontSize?: string;
  readonly headingFontSize?: string;
  readonly className?: string;
}

interface ProfileData {
  readonly name: string;
  readonly value: number;
  readonly method?: string;
}

interface CellData {
  percent: string;
  people: ProfileData[];
}

const KolbeGraph: React.FC<KolbeGraphProps> = ({
  profiles,
  tableName,
  baseFontSize = "text-base",
  headingFontSize = "text-3xl",
  className,
}) => {
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

  const columnHeaders = [
    "Fact Finder",
    "Follow Thru",
    "Quick Start",
    "Implementor",
  ];

  const rowLabels = [
    "CounterAct (1-3)",
    "ReAct (4-6)",
    "Initiative Action (7-10)",
  ];

  const columnToProperty: Record<string, KolbeStrengthField> = {
    "Fact Finder": "factFinder",
    "Follow Thru": "followThru",
    "Quick Start": "quickStart",
    Implementor: "implementer",
  };

  const columnColors = [
    "border-inspireRed",
    "border-inspireBlue",
    "border-inspireGreen",
    "border-inspireYellow",
  ];

  const columnNumberColors = [
    "text-inspireRed",
    "text-inspireBlue",
    "text-inspireGreen",
    "text-inspireYellow",
  ];

  const processProfiles = () => {
    const data: CellData[][] = Array(3)
      .fill(null)
      .map(() =>
        Array(4)
          .fill(null)
          .map(() => ({ percent: "0%", people: [] }))
      );

    if (!profiles || profiles.length === 0) return data;

    const totalProfiles = profiles.length;

    profiles.forEach((profile) => {
      columnHeaders.forEach((header, colIndex) => {
        const propertyName = columnToProperty[header];
        const strengthObj = profile.kolbeStrengths2?.[propertyName];

        const numericValue = getKolbeNumericValue(strengthObj);

        if (!numericValue) return;

        let rowIndex;
        if (numericValue >= 7 && numericValue <= 10) {
          rowIndex = 2;
        } else if (numericValue >= 4 && numericValue <= 6) {
          rowIndex = 1;
        } else if (numericValue >= 1 && numericValue <= 3) {
          rowIndex = 0;
        } else {
          return;
        }

        data[rowIndex][colIndex].people.push({
          name: profile.name,
          value: numericValue,
          method: getKolbeMethod(strengthObj, propertyName)?.method || "",
        });
      });
    });

    data.forEach((row) => {
      row.forEach((cell) => {
        cell.people.sort((a, b) => b.value - a.value);
      });
    });

    columnHeaders.forEach((_, colIndex) => {
      rowLabels.forEach((_, rowIndex) => {
        const peopleCount = data[rowIndex][colIndex].people.length;
        const percentage =
          totalProfiles > 0
            ? Math.round((peopleCount / totalProfiles) * 100)
            : 0;
        data[rowIndex][colIndex].percent = `${percentage}%`;
      });
    });

    return data;
  };

  const gridData = processProfiles();

  return (
    <div className={`${className} space-y-4 mb-4`}>
      <h2 className="text-base font-semibold">{tableName}</h2>
      <div className="w-full mx-auto">
        <div className="flex mb-2">
          <div className="w-8 mr-4"></div>

          <div className="flex-1 grid grid-cols-4 gap-2">
            {columnHeaders.map((header, colIndex) => {
              let HeaderIcon;
              switch (colIndex) {
                case 0:
                  HeaderIcon = GoTools;
                  break;
                case 1:
                  HeaderIcon = GoTab;
                  break;
                case 2:
                  HeaderIcon = GoSearch;
                  break;
                case 3:
                  HeaderIcon = GoRocket;
                  break;
                default:
                  HeaderIcon = null;
              }

              return (
                <div
                  key={`header-${colIndex}`}
                  className={`text-center font-medium p-2 ${columnColors[colIndex]} flex items-center justify-center gap-3 `}
                >
                  {HeaderIcon && <HeaderIcon strokeWidth={1} size={18} />}
                  <span className="font-bold">{header}</span>
                </div>
              );
            })}
          </div>
        </div>

        {gridData.map((row: CellData[], rowIndex: number) => (
          <div
            key={`row-${rowIndex + 1}`}
            className={`break-inside-avoid flex mb-2 `}
          >
            <div className="w-8 mr-4 flex items-center justify-center">
              <div className="transform -rotate-90 whitespace-nowrap flex items-center">
                <span className="font-bold">{rowLabels[rowIndex]}</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-4 gap-2 min-h-48">
              {row.map((cell: CellData, colIndex: number) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className={`border-4 rounded-lg p-3 ${columnColors[colIndex]}`}
                >
                  <div
                    className={`${headingFontSize} font-bold text-center mb-2`}
                  >
                    {cell.percent}
                  </div>

                  <div className="border-t border-light3 mb-2"></div>

                  <div className="space-y-1">
                    {cell.people.map(
                      (profile: ProfileData, profileIndex: number) => (
                        <div
                          key={`profile-${rowIndex}-${colIndex}-${profileIndex}`}
                          className={`flex justify-between ${baseFontSize}`}
                        >
                          <span>{profile.name}</span>
                          <span
                            className={`${columnNumberColors[colIndex]} font-bold`}
                          >
                            {profile.value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KolbeGraph;
