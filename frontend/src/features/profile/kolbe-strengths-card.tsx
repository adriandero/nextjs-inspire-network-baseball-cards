"use client";
import { Progress } from "@/src/components/shadcn-ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/shadcn-ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn-ui/tooltip";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go";

import React, { useState } from "react";
import ComponentShell from "../../components/custom-ui/component-shell";
import { getKolbeMethod } from "@/src/lib/utils";
import { CollapseAll } from "@/src/shared/assets/icons/collapse-all";
import { ExpandAll } from "@/src/shared/assets/icons/expand-all";
import { Button } from "@/src/components/shadcn-ui/button";
import { Profile } from "@/src/lib/entities/profile";

interface KolbeStrengthsCardProps {
  readonly profile: Profile;
}

export default function KolbeStrengthsCard({
  profile,
}: KolbeStrengthsCardProps): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;

  const [openItems, setOpenItems] = useState<string[]>([]);
  const allItems = ["item-1", "item-2", "item-3", "item-4"];
  const allOpen = openItems.length === allItems.length;
  const handleToggle = () => {
    setOpenItems(allOpen ? [] : allItems);
  };

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
        <div className="flex flex-col w-full h-fit items-start md:pl-6">
          <div className="flex flex-row w-full">
            <GoLaw strokeWidth={0.5} size={24} className="flex self-start" />
            <h2 className="text-xl font-bold ml-6">Kolbe Strengths</h2>
            <Button
              variant="ghost"
              onClick={handleToggle}
              size="xsIcon"
              className="ml-auto"
              aria-label={
                allOpen ? "Collapse all sections" : "Expand all sections"
              }
            >
              {allOpen ? <CollapseAll size={16} /> : <ExpandAll size={16} />}
            </Button>
          </div>
          <TooltipProvider>
            <Accordion
              type="multiple"
              className="w-full pt-4 pl-1"
              value={openItems}
              onValueChange={setOpenItems}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-6">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoSearch strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Fact Finder</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.factFinder ? kolbeObj?.factFinder * 10 : 0
                      }
                      color="bg-inspireRed"
                    />
                    <div className="font-bold text-lg">
                      {kolbeObj?.factFinder ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-12">
                  <h3 className="text-lg font-bold">
                    {factFinderMethod?.method}
                  </h3>
                  <p className="text-base">{factFinderMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-6">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTab strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Follow Thru</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.followThru ? kolbeObj?.followThru * 10 : 0
                      }
                      color="bg-inspireBlue"
                    />
                    <div className="font-bold text-lg">
                      {kolbeObj?.followThru ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-12">
                  <h3 className="text-lg font-bold">
                    {followThruMethod?.method}
                  </h3>
                  <p className="text-base">{followThruMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-6">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoRocket strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Quick Start</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.quickStart ? kolbeObj?.quickStart * 10 : 0
                      }
                      color="bg-inspireGreen"
                    />
                    <div className="font-bold text-lg">
                      {kolbeObj?.quickStart ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-12">
                  <h3 className="text-lg font-bold">
                    {quickStartMethod?.method}
                  </h3>
                  <p className="text-base">{quickStartMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-6">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTools strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Implementer</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.implementer ? kolbeObj?.implementer * 10 : 0
                      }
                      color="bg-inspireYellow"
                    />
                    <div className="font-bold text-lg">
                      {kolbeObj?.implementer ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-12">
                  <h3 className="text-lg font-bold">
                    {implementerMethod?.method}
                  </h3>
                  <p className="text-base">{implementerMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TooltipProvider>
        </div>
      </div>
    </ComponentShell>
  );
}
