import React from "react";
import { TableCell, TableRow } from "@/src/components/shadcn-ui/table";
import { flexRender, Row } from "@tanstack/react-table";
import { useDraggable } from "@dnd-kit/core";
import { ProfileWithDetailedTeams } from "@/src/shared/entities/profile.types";

interface DraggableProfileRowProps {
  row: Row<ProfileWithDetailedTeams>;
  onProfileCheck: (uuid: string) => void;
}

export const DraggableProfileRow: React.FC<DraggableProfileRowProps> = ({
  row,
  onProfileCheck,
}) => {
  const profile = row.original;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: profile.uuid,
    data: { profile },
  });

  return (
    <TableRow
      key={row.id}
      data-state={row.getIsSelected() && "selected"}
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      {...attributes}
      {...listeners}
      data-draggable="true"
      onClick={() => onProfileCheck(profile.uuid)}
      className="hover:bg-primary/5 relative group"
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
};
