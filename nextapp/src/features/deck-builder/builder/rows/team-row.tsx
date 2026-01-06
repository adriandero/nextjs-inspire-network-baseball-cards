import React from "react";
import { TableCell, TableRow } from "@/src/components/shadcn-ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { TeamWithPopulatedCompany } from "@/src/shared/entities/team.types";

interface TeamRowProps {
  row: Row<TeamWithPopulatedCompany>;
  onTeamClick?: (teamSlug: string, teamName: string) => void;
  isClickable?: boolean;
}

export const TeamRow: React.FC<TeamRowProps> = ({
  row,
  onTeamClick,
  isClickable = false,
}) => {
  const team = row.original;

  const handleClick = () => {
    if (isClickable && onTeamClick) {
      onTeamClick(team.slug || team._id, team.name);
    }
  };

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      onClick={handleClick}
      className={isClickable ? " hover:bg-primary/5" : ""}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
