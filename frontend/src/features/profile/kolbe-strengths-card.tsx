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

import { GoLaw, GoSearch, GoRocket, GoTools, GoTab } from "react-icons/go";

import React, { useState } from "react";
import ComponentShell from "../../components/custom-ui/component-shell";
import {
  getKolbeDisplayValue,
  getKolbeMethod,
  getKolbeNumericValue,
  KolbeStrengthField,
} from "@/src/lib/utils";
import { CollapseAll } from "@/src/shared/assets/icons/collapse-all";
import { ExpandAll } from "@/src/shared/assets/icons/expand-all";
import { Button } from "@/src/components/shadcn-ui/button";
import { KolbeStrength, Profile } from "@/src/lib/entities/profile";

interface KolbeStrengthRowProps {
  accordionValue: string;
  strengthValue?: KolbeStrength;
  field: KolbeStrengthField;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export function KolbeStrengthRow({
  accordionValue,
  strengthValue,
  field,
  icon,
  label,
  color,
}: KolbeStrengthRowProps) {
  const method = getKolbeMethod(strengthValue, field);
  const numericValue = getKolbeNumericValue(strengthValue);
  const displayValue = getKolbeDisplayValue(strengthValue);

  return (
    <AccordionItem value={accordionValue}>
      <AccordionTrigger>
        <div className="w-full flex flex-row items-center gap-6">
          <Tooltip>
            <TooltipTrigger asChild>{icon}</TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>

          <Progress
            value={numericValue ? numericValue * 10 : 0}
            color={color}
          />
          <div className="font-bold text-lg">{displayValue}</div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="ml-12">
        <p className="text-xs text-dark3">{label}</p>
        {method?.method ? (
          <h3 className="text-lg font-bold">{method?.method}</h3>
        ) : (
          <div className=" text-base flex w-full h-fit italic text-dark3 pt-1">
            {" "}
            <p>No Result.</p>
          </div>
        )}
        <p className="text-base">{method?.description}</p>
      </AccordionContent>
    </AccordionItem>
  );
}

interface KolbeStrengthsCardProps {
  readonly profile: Profile;
}

export default function KolbeStrengthsCard({
  profile,
}: KolbeStrengthsCardProps): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths2;

  const [openItems, setOpenItems] = useState<string[]>([]);
  const allItems = ["item-1", "item-2", "item-3", "item-4"];
  const allOpen = openItems.length === allItems.length;
  const handleToggle = () => {
    setOpenItems(allOpen ? [] : allItems);
  };

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
              <KolbeStrengthRow
                accordionValue="item-1"
                strengthValue={kolbeObj?.factFinder}
                field="factFinder"
                icon={<GoSearch strokeWidth={0.5} size={20} />}
                label="Fact Finder"
                color="bg-inspireRed"
              />
              <KolbeStrengthRow
                accordionValue="item-2"
                strengthValue={kolbeObj?.followThru}
                field="followThru"
                icon={<GoTab strokeWidth={0.5} size={20} />}
                label="Follow Thru"
                color="bg-inspireBlue"
              />
              <KolbeStrengthRow
                accordionValue="item-3"
                strengthValue={kolbeObj?.quickStart}
                field="quickStart"
                icon={<GoRocket strokeWidth={0.5} size={20} />}
                label="Quick Start"
                color="bg-inspireGreen"
              />
              <KolbeStrengthRow
                accordionValue="item-4"
                strengthValue={kolbeObj?.implementer}
                field="implementer"
                icon={<GoTools strokeWidth={0.5} size={20} />}
                label="Implementer"
                color="bg-inspireYellow"
              />
            </Accordion>
          </TooltipProvider>
        </div>
      </div>
    </ComponentShell>
  );
}
