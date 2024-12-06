"use client";
import { Progress } from "@/components/ui/Progress";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go"; // Importing some icons for the radio items

import React from "react";
import { SanityDocument } from "next-sanity";


// type principle = {
//   title: string;
//   description: string;
// };

export default function PDFKolbeStrengthsCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;

  return (
    <div className={`${className}flex`}>
      <div className="flex flex-col w-full h-fit items-start gap-6">
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
              value={kolbeObj.factFinder.strengthLevel * 10}
              color="bg-inspireRed"
            />
            <div className="font-bold text-lg">
              {kolbeObj.factFinder.strengthLevel}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {kolbeObj.factFinder.methodOfOperation}
          </h3>
          <p className="text-base ml-12">{kolbeObj.factFinder.meaning}</p>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Follow Through</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoTab strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj.followThru.strengthLevel * 10}
              color="bg-inspireBlue"
            />
            <div className="font-bold text-lg">
              {kolbeObj.followThru.strengthLevel}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {kolbeObj.followThru.methodOfOperation}
          </h3>
          <p className="text-base ml-12">{kolbeObj.followThru.meaning}</p>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Quick Start</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoRocket strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj.quickStart.strengthLevel * 10}
              color="bg-inspireGreen"
            />
            <div className="font-bold text-lg">
              {kolbeObj.quickStart.strengthLevel}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {kolbeObj.quickStart.methodOfOperation}
          </h3>
          <p className="text-base ml-12">{kolbeObj.quickStart.meaning}</p>
        </div>
        <div className="h-fit w-full">
          <h3 className="text-xs font-bold ml-12">Implmenter</h3>
          <div className="w-full flex flex-row items-center gap-6">
            <GoTools strokeWidth={0.5} size={28} />

            <Progress
              value={kolbeObj.implementer.strengthLevel * 10}
              color="bg-inspireYellow"
            />
            <div className="font-bold text-lg">
              {kolbeObj.implementer.strengthLevel}
            </div>
          </div>

          <h3 className="text-base font-bold ml-12">
            {kolbeObj.implementer.methodOfOperation}
          </h3>
          <p className="text-base ml-12">{kolbeObj.implementer.meaning}</p>
        </div>
      </div>
    </div>
  );
}
