import { SanityDocument } from "next-sanity";

import { GoLaw, GoRocket, GoSearch, GoTab, GoTools } from "react-icons/go";
import React, { useState } from "react";
import { getKolbeMethod } from "@/src/lib/utils";
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
import { Progress } from "@/src/components/shadcn-ui/progress";
import { Button } from "@/src/components/shadcn-ui/button";
import { CollapseAll } from "@/src/shared/assets/icons/collapse-all";
import { ExpandAll } from "@/src/shared/assets/icons/expand-all";

export default function KolbeStrengthsCard({
  profile,
}: SanityDocument): React.JSX.Element {
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
    <div className="w-full h-fit border border-light3 bg-background rounded-2xl p-4 group">
      <div className="flex flex-row">
        <div className="flex flex-col w-full ">
          <div className="flex flex-row items-center">
            <GoLaw strokeWidth={0.5} size={20} className="flex mr-4" />
            <h2 className="text-lg font-bold">Kolbe Strengths</h2>
            <Button
              variant="ghost"
              onClick={handleToggle}
              size="xsIcon"
              className="ml-auto transition-opacity duration-200 ease-in-out group-hover:opacity-100 opacity-0"
              aria-label={
                allOpen ? "Collapse all sections" : "Expand all sections"
              }
            >
              {allOpen ? <CollapseAll size={14} /> : <ExpandAll size={14} />}
            </Button>
          </div>
          <TooltipProvider>
            <Accordion
              type="multiple"
              className="w-full pl-0.5"
              value={openItems}
              onValueChange={setOpenItems}
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoSearch strokeWidth={0.5} size={18} />
                      </TooltipTrigger>
                      <TooltipContent>Fact Finder</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.factFinder ? kolbeObj?.factFinder * 10 : 0
                      }
                      color="bg-inspireRed"
                    />
                    <div className="font-bold text-base">
                      {kolbeObj?.factFinder ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8">
                  <h3 className="text-base font-bold">
                    {factFinderMethod?.method}
                  </h3>
                  <p className="text-sm">{factFinderMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTab strokeWidth={0.5} size={18} />
                      </TooltipTrigger>
                      <TooltipContent>Follow Thru</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.followThru ? kolbeObj?.followThru * 10 : 0
                      }
                      color="bg-inspireBlue"
                    />
                    <div className="font-bold text-base">
                      {kolbeObj?.followThru ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8">
                  <h3 className="text-base font-bold">
                    {followThruMethod?.method}
                  </h3>
                  <p className="text-sm">{followThruMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoRocket strokeWidth={0.5} size={18} />
                      </TooltipTrigger>
                      <TooltipContent>Quick Start</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.quickStart ? kolbeObj?.quickStart * 10 : 0
                      }
                      color="bg-inspireGreen"
                    />
                    <div className="font-bold text-base">
                      {kolbeObj?.quickStart ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8">
                  <h3 className="text-base font-bold">
                    {quickStartMethod?.method}
                  </h3>
                  <p className="text-sm">{quickStartMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="w-full flex flex-row items-center gap-4">
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTools strokeWidth={0.5} size={18} />
                      </TooltipTrigger>
                      <TooltipContent>Implementer</TooltipContent>
                    </Tooltip>

                    <Progress
                      value={
                        kolbeObj?.implementer ? kolbeObj?.implementer * 10 : 0
                      }
                      color="bg-inspireYellow"
                    />
                    <div className="font-bold text-base">
                      {kolbeObj?.implementer ?? "*"}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ml-8">
                  <h3 className="text-base font-bold">
                    {implementerMethod?.method}
                  </h3>
                  <p className="text-sm">{implementerMethod?.description}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
