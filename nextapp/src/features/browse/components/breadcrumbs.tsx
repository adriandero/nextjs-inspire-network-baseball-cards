import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/src/components/shadcn-ui/breadcrumbs";
import { SanityDocument } from "next-sanity";

interface BreadcrumbsProps {
  groupingMode: "teams" | "profiles";
  currentView: "teams" | "profiles";
  selectedTeam: SanityDocument | null;
  onReturnToTeams: () => void;
}

export function Breadcrumbs({
  groupingMode,
  currentView,
  selectedTeam,
  onReturnToTeams,
}: BreadcrumbsProps) {
  const getBreadcrumbContent = () => {
    if (groupingMode === "profiles") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All TUG Cards</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else if (currentView === "teams") {
      return (
        <BreadcrumbItem>
          <BreadcrumbLink href="#">All Teams</BreadcrumbLink>
        </BreadcrumbItem>
      );
    } else {
      return (
        <>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={onReturnToTeams} className="">
              All Teams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{selectedTeam?.name}</BreadcrumbLink>
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
}
