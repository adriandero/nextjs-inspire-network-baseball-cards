"use client";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go"; // Importing some icons for the radio items

import React from "react";
import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";
import { getKolbeMethod } from "@/lib/utils";

// type principle = {
//   title: string;
//   description: string;
// };

export default function KolbeStrengthsCard({
  profile,
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
    <ComponentShell>
      <div className="flex flex-row">
        <div className="hidden md:flex flex-row items-center w-fit h-fit">
          <GoLaw strokeWidth={0.5} size={24} className="flex self-start" />{" "}
        </div>
        <div className="flex flex-col w-full h-fit items-start md:pl-6">
          <div className="flex md:hidden flex-row">
            <GoLaw strokeWidth={0.5} size={24} className="flex self-start" />{" "}
            <h2 className="text-xl font-bold ml-6">Kolbe Strengths</h2>
          </div>
          <h2 className="hidden md:block text-xl font-bold">Kolbe Strengths</h2>
          <Accordion type="multiple" className="w-full pt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoSearch strokeWidth={0.5} size={24} />
                      </TooltipTrigger>
                      <TooltipContent>Fact Finder</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.factFinder ? kolbeObj?.factFinder * 10 : 0}
                    color="bg-inspireRed"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj?.factFinder}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {factFinderMethod?.method}
                </h3>
                <p className="text-base">{factFinderMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTab strokeWidth={0.5} size={24} />
                      </TooltipTrigger>
                      <TooltipContent>Follow Thru</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.followThru ? kolbeObj?.followThru * 10 : 0}
                    color="bg-inspireBlue"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj?.followThru}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {followThruMethod?.method}
                </h3>
                <p className="text-base">{followThruMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoRocket strokeWidth={0.5} size={24} />
                      </TooltipTrigger>
                      <TooltipContent>Quick Start</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.quickStart ? kolbeObj?.quickStart * 10 : 0}
                    color="bg-inspireGreen"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj?.quickStart}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {quickStartMethod?.method}
                </h3>
                <p className="text-base">{quickStartMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTools strokeWidth={0.5} size={24} />
                      </TooltipTrigger>
                      <TooltipContent>Implementer</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={
                      kolbeObj?.implementer ? kolbeObj?.implementer * 10 : 0
                    }
                    color="bg-inspireYellow"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj?.implementer}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {implementerMethod?.method}
                </h3>
                <p className="text-base">{implementerMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentShell>
  );
}
