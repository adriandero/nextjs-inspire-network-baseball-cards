"use client";
import { Progress } from "@/src/components/ui/progress";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go"; // Importing some icons for the radio items

import React from "react";
import { SanityDocument } from "next-sanity";
import { getKolbeMethod } from "@/src/lib/utils";

// type principle = {
//   title: string;
//   description: string;
// };

export default function PdfKolbeStrengthsCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;

  const factFinderMethod = getKolbeMethod(kolbeObj?.factFinder, "factFinder");
  const followThruMethod = getKolbeMethod(kolbeObj?.followThru, "followThru");
  const quickStartMethod = getKolbeMethod(kolbeObj?.quickStart, "quickStart");
  const implementerMethod = getKolbeMethod(
    kolbeObj?.implementer,
    "implementer"
  );

  return (
    <div className={`${className} flex`}>
      <div className="flex flex-col w-full h-fit items-start gap-4">
        <div className="flex flex-row">
          <GoLaw
            strokeWidth={0.5}
            size={22}
            className="flex self-start mt-0.5"
          />{" "}
          <h2 className="text-lg font-bold ml-6">Kolbe Strengths</h2>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Fact Finder</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoSearch strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj?.factFinder ? kolbeObj?.factFinder * 10 : 0}
              color="bg-inspireRed"
            />
            <div className="font-bold text-lg">
              {/* TODO: bug: when nothing entered in sanity, doesnt even present the object attribute so nothing to call */}
              {kolbeObj?.factFinder ?? "*"}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {factFinderMethod?.method}
            {kolbeObj?.factFinder ? ":" : null}{" "}
            <span className="text-base font-normal">
              {factFinderMethod?.description}
            </span>
          </h3>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Follow Through</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoTab strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj?.followThru ? kolbeObj?.followThru * 10 : 0}
              color="bg-inspireBlue"
            />
            <div className="font-bold text-lg">
              {kolbeObj?.followThru ?? "*"}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {followThruMethod?.method}
            {kolbeObj?.followThru ? ":" : null}{" "}
            <span className="text-base font-normal">
              {followThruMethod?.description}
            </span>
          </h3>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Quick Start</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoRocket strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj?.quickStart ? kolbeObj?.quickStart * 10 : 0}
              color="bg-inspireGreen"
            />
            <div className="font-bold text-lg">
              {kolbeObj?.quickStart ?? "*"}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {quickStartMethod?.method}
            {kolbeObj?.quickStart ? ":" : null}{" "}
            <span className="text-base font-normal">
              {quickStartMethod?.description}
            </span>
          </h3>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Implementer</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoTools strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj?.implementer ? kolbeObj?.implementer * 10 : 0}
              color="bg-inspireYellow"
            />
            <div className="font-bold text-lg">
              {kolbeObj?.implementer ?? "*"}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {implementerMethod?.method}
            {kolbeObj?.implementer ? ":" : null}{" "}
            <span className="text-base font-normal">
              {implementerMethod?.description}
            </span>
          </h3>
        </div>
      </div>
    </div>
  );
}
