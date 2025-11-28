import { SanityDocument } from "next-sanity";

import { GoLaw, GoRocket, GoSearch, GoTab, GoTools } from "react-icons/go";
import React, { useState } from "react";
import {
  getKolbeDisplayValue,
  getKolbeMethod,
  getKolbeNumericValue,
  KolbeStrengthField,
} from "@/src/lib/utils";
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
import { KolbeStrength } from "@/src/lib/entities/profile";

interface DeckBuilderKolbeStrengthRowProps {
  accordionValue: string;
  strengthValue?: KolbeStrength;
  field: KolbeStrengthField;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export function DeckBuilderKolbeStrengthRow({
  accordionValue,
  strengthValue,
  field,
  icon,
  label,
  color,
}: DeckBuilderKolbeStrengthRowProps) {
  const method = getKolbeMethod(strengthValue, field);
  const numericValue = getKolbeNumericValue(strengthValue);
  const displayValue = getKolbeDisplayValue(strengthValue);

  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger>
        <div className="w-full flex flex-row items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>

          <Progress
            value={numericValue ? numericValue * 10 : 0}
            color={color}
          />
          <div className="font-bold text-base">{displayValue}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="ml-8">
        <p className="text-xs text-dark3">{label}</p>
        {method?.method ? (
          <h3 className="text-base font-bold">{method?.method}</h3>
        ) : (
          <div className="flex text-base w-full h-fit italic text-dark3 pt-1">
            {" "}
            <p>No Result.</p>
          </div>
        )}
        <p className="text-sm">{method?.description}</p>
      </AccordionContent>
    </AccordionItem>
  );
}
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

  return (
    <div className="w-full h-fit border border-light3 bg-background rounded-lg p-4 group">
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
              <DeckBuilderKolbeStrengthRow
                accordionValue="item-1"
                strengthValue={kolbeObj?.factFinder}
                field="factFinder"
                icon={<GoSearch strokeWidth={0.5} size={22} />}
                label="Fact Finder"
                color="bg-inspireRed"
              />
              <DeckBuilderKolbeStrengthRow
                accordionValue="item-2"
                strengthValue={kolbeObj?.followThru}
                field="followThru"
                icon={<GoTab strokeWidth={0.5} size={22} />}
                label="Follow Thru"
                color="bg-inspireBlue"
              />
              <DeckBuilderKolbeStrengthRow
                accordionValue="item-3"
                strengthValue={kolbeObj?.quickStart}
                field="quickStart"
                icon={<GoRocket strokeWidth={0.5} size={22} />}
                label="Quick Start"
                color="bg-inspireGreen"
              />
              <DeckBuilderKolbeStrengthRow
                accordionValue="item-4"
                strengthValue={kolbeObj?.implementer}
                field="implementer"
                icon={<GoTools strokeWidth={0.5} size={22} />}
                label="Implementer"
                color="bg-inspireYellow"
              />
            </Accordion>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
