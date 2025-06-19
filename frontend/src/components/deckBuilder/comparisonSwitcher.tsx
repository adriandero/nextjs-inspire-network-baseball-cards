"use client"; // for client-side interactivity

import { FC, useState } from "react";
import WorkingGeniusTable, {
  WorkingGeniusTableProps,
} from "@/components/compare/dataTables/workingGeniusTable";
import { CompareType } from "@/components/deckBuilder/deckBuilderStore";
import KolbeStrengthsTable, {
  KolbeStrengthsTableProps,
} from "../compare/dataTables/kolbeStrengthsTable";
import KolbeGraph, { KolbeGraphProps } from "./dataTables/kolbeGraph";
import ValuesTable, {
  ValuesTableProps,
} from "../compare/dataTables/valuesTable";

export function ComparisonSwitcher({
  initialType,
  data
}: {
  initialType: CompareType;
  data: 
}) {
  const [selectedType, setSelectedType] = useState(initialType);

  const comparisonTableMap = {
    [CompareType.WORKING_GENIUS]: {
      component: WorkingGeniusTable,
      props: { workingGeniusData: data.geniusData },
    },
    [CompareType.KOLBE_STRENGTHS]: KolbeStrengthsTable,
    [CompareType.KOLBE_GRAPH]: KolbeGraph,
    [CompareType.VALUES]: ValuesTable,
  };

  const TableComponent = comparisonTableMap[selectedType];

  return (
    <div>
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as CompareType)}
      >
        {Object.values(CompareType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <TableComponent profiles={[]} showJobRole={false} />
    </div>
  );
}
