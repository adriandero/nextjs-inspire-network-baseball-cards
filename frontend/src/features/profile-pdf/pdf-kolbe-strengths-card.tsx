"use client";
import { Progress } from "@/src/components/shadcn-ui/progress";

import { GoLaw, GoSearch, GoTab, GoRocket, GoTools } from "react-icons/go";

import React from "react";
import { SanityDocument } from "next-sanity";
import {
  getKolbeMethod,
  getKolbeNumericValue,
  getKolbeDisplayValue,
  KolbeStrengthField,
} from "@/src/lib/utils";
import { KolbeStrength } from "@/src/lib/entities/profile";

interface PdfKolbeStrengthRowProps {
  strengthValue?: KolbeStrength;
  field: KolbeStrengthField;
  icon: React.ReactNode;
  label: string;
  color: string;
}

export function PdfKolbeStrengthRow({
  strengthValue,
  field,
  icon,
  label,
  color,
}: PdfKolbeStrengthRowProps) {
  const method = getKolbeMethod(strengthValue, field);
  const numericValue = getKolbeNumericValue(strengthValue);
  const displayValue = getKolbeDisplayValue(strengthValue);

  return (
    <div className="h-fit w-full">
      <h3 className="text-xs font-bold ml-12">{label}</h3>
      <div className="w-full flex flex-row items-center gap-6">
        {icon}
        <Progress value={numericValue ? numericValue * 10 : 0} color={color} />
        <div className="font-bold text-lg">{displayValue}</div>
      </div>


      <h3 className="text-base font-bold ml-12">
        {method?.method}
        {numericValue ? ":" : null}{" "}
        <span className="text-base font-normal">{method?.description}</span>
      </h3>
    </div>
  );
}

export default function PdfKolbeStrengthsCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  const kolbeObj = profile.kolbeStrengths;

  return (
    <div className={`${className} flex`}>
      <div className="flex flex-col w-full h-fit items-start gap-4">
        <div className="flex flex-row">
          <GoLaw
            strokeWidth={0.5}
            size={22}
            className="flex self-start mt-0.5"
          />
          <h2 className="text-lg font-bold ml-6">Kolbe Strengths</h2>
        </div>

        <PdfKolbeStrengthRow
          strengthValue={kolbeObj?.factFinder}
          field="factFinder"
          icon={<GoSearch strokeWidth={0.5} size={28} />}
          label="Fact Finder"
          color="bg-inspireRed"
        />

        <PdfKolbeStrengthRow
          strengthValue={kolbeObj?.followThru}
          field="followThru"
          icon={<GoTab strokeWidth={0.5} size={28} />}
          label="Follow Through"
          color="bg-inspireBlue"
        />

        <PdfKolbeStrengthRow
          strengthValue={kolbeObj?.quickStart}
          field="quickStart"
          icon={<GoRocket strokeWidth={0.5} size={28} />}
          label="Quick Start"
          color="bg-inspireGreen"
        />

        <PdfKolbeStrengthRow
          strengthValue={kolbeObj?.implementer}
          field="implementer"
          icon={<GoTools strokeWidth={0.5} size={28} />}
          label="Implementer"
          color="bg-inspireYellow"
        />
      </div>
    </div>
  );
}
