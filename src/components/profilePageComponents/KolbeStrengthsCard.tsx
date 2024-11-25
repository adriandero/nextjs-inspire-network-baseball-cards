"use client";
import { Progress } from "@/components/ui/Progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go"; // Importing some icons for the radio items

import React from "react";
import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";

// type principle = {
//   title: string;
//   description: string;
// };

export default function KolbeStrengthsCard({
  profile,
}: SanityDocument): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;
  const kolbeObjKeysArr = Object.keys(kolbeObj);

  return (
    <ComponentShell>
      <div className="flex flex-row">
        <div className="hidden xs:flex flex-row items-center w-fit h-fit">
          <GoLaw strokeWidth={0.5} size={24} className="flex self-start" />{" "}
        </div>
        <div className="flex flex-col w-full h-fit items-start xs:pl-6">
          <div className="flex xs:hidden flex-row">
            <GoLaw strokeWidth={0.5} size={24} className="flex self-start" />{" "}
            <h2 className="text-xl font-bold ml-6">Kolbe Strengths</h2>
          </div>
          <h2 className="hidden xs:block text-xl font-bold">Kolbe Strengths</h2>
          <Accordion type="single" collapsible className="w-full pt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-6">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoSearch strokeWidth={0.5} size={24} />
                      </TooltipTrigger>
                      <TooltipContent>{kolbeObjKeysArr[0]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj.factFinder.strengthLevel * 10}
                    color="bg-inspireRed"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj.factFinder.strengthLevel}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {kolbeObj.factFinder.methodOfOperation}
                </h3>
                <p className="text-base">{kolbeObj.factFinder.meaning}</p>
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
                      <TooltipContent>{kolbeObjKeysArr[1]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj.followThru.strengthLevel * 10}
                    color="bg-inspireBlue"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj.followThru.strengthLevel}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {kolbeObj.followThru.methodOfOperation}
                </h3>
                <p className="text-base">{kolbeObj.followThru.meaning}</p>
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
                      <TooltipContent>{kolbeObjKeysArr[2]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj.quickStart.strengthLevel * 10}
                    color="bg-inspireGreen"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj.quickStart.strengthLevel}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {kolbeObj.quickStart.methodOfOperation}
                </h3>
                <p className="text-base">{kolbeObj.quickStart.meaning}</p>
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
                      <TooltipContent>{kolbeObjKeysArr[3]}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj.implementer.strengthLevel * 10}
                    color="bg-inspireYellow"
                  />
                  <div className="font-bold text-lg">
                    {kolbeObj.implementer.strengthLevel}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-lg font-bold">
                  {kolbeObj.implementer.methodOfOperation}
                </h3>
                <p className="text-base">{kolbeObj.implementer.meaning}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </ComponentShell>
  );
}
