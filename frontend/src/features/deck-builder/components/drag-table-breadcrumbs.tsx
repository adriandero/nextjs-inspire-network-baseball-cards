import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/src/components/shadcn-ui/breadcrumbs";

interface TableBreadcrumbsProps {
  groupingMode: "teams" | "profiles";
  view: "teams" | "profiles";
  selectedTeamName: string;
  onBackToTeams: () => void;
}

export const DragTableBreadcrumbs: React.FC<TableBreadcrumbsProps> = ({
  groupingMode,
  view,
  selectedTeamName,
  onBackToTeams,
}) => {
  const getBreadcrumbContent = () => {
    if (groupingMode === "profiles") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All TUG Cards</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else if (view === "teams") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All Teams</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else {
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onBackToTeams} className="cursor-pointer">
              All Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{selectedTeamName}</BreadcrumbLink>
          </BreadcrumbItem>
        </>
      );
    }
  };

  return (
    <Breadcrumb className="justify-self-start">
      <BreadcrumbList>{getBreadcrumbContent()}</BreadcrumbList>
    </Breadcrumb>
  );
};
