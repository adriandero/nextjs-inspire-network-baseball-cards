import { SanityDocument } from "next-sanity";

import {
  GoLaw,
  GoLightBulb,
  GoRocket,
  GoSearch,
  GoTab,
  GoTools,
} from "react-icons/go";
import workingGeniusJson from "@/public/json/working-genius.json";
import WidgetCogsSVG from "@/public/illustrations/widget-cogs-svg";
import { PiDiamondsFour } from "react-icons/pi";
import principlesYouJson from "@/public/json/principles-you-archetypes.json";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/src/components/shadcn-ui/radio-group";
import Image from "next/image";
import { getArchetypeImage } from "@/src/lib/asset-mapping/principle-you-archetype-images-mapping";
import React from "react";
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

export default function KolbeStrengthsCard({
  profile,
}: SanityDocument): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;

  const factFinderMethod = getKolbeMethod(kolbeObj?.factFinder, "factFinder");
  const followThruMethod = getKolbeMethod(kolbeObj?.followThru, "followThru");
  const quickStartMethod = getKolbeMethod(kolbeObj?.quickStart, "quickStart");
  const implementerMethod = getKolbeMethod(
    kolbeObj?.implementer,
    "implementer",
  );

  return (
    <div className="w-full h-fit border border-light3 bg-background rounded-2xl p-4">
      <div className="flex flex-row">

        <div className="flex flex-col w-full ">
          <div className="flex flex-row items-center">
            <GoLaw strokeWidth={0.5} size={20} className="flex mr-4" />{" "}
            <h2 className="text-lg font-bold">Kolbe Strengths</h2>
          </div>
          <Accordion type="multiple" className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoSearch strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Fact Finder</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.factFinder ? kolbeObj?.factFinder * 10 : 0}
                    color="bg-inspireRed"
                  />
                  <div className="font-bold text-base">
                    {kolbeObj?.factFinder}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-base font-bold">
                  {factFinderMethod?.method}
                </h3>
                <p className="text-sm">{factFinderMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTab strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Follow Thru</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.followThru ? kolbeObj?.followThru * 10 : 0}
                    color="bg-inspireBlue"
                  />
                  <div className="font-bold text-base">
                    {kolbeObj?.followThru}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-base font-bold">
                  {followThruMethod?.method}
                </h3>
                <p className="text-sm">{followThruMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoRocket strokeWidth={0.5} size={20} />
                      </TooltipTrigger>
                      <TooltipContent>Quick Start</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Progress
                    value={kolbeObj?.quickStart ? kolbeObj?.quickStart * 10 : 0}
                    color="bg-inspireGreen"
                  />
                  <div className="font-bold text-base">
                    {kolbeObj?.quickStart}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-base font-bold">
                  {quickStartMethod?.method}
                </h3>
                <p className="text-sm">{quickStartMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                <div className="w-full flex flex-row items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <GoTools strokeWidth={0.5} size={20} />
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
                  <div className="font-bold text-base">
                    {kolbeObj?.implementer}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <h3 className="text-base font-bold">
                  {implementerMethod?.method}
                </h3>
                <p className="text-sm">{implementerMethod?.description}</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
