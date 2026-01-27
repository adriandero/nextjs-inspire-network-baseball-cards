"use client";

import {
  GoDownload,
  GoKebabHorizontal,
  GoNorthStar,
  GoEye,
} from "react-icons/go";
import ComponentShell from "../../components/custom-ui/component-shell";
import { Badge } from "@/src/components/shadcn-ui/badge";
import { Profile } from "@/src/shared/entities/profile.types";
import { Button } from "@/src/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import { useAssessmentActions } from "@/src/hooks/profile/use-assessment-action";

interface ValuesCardProps {
  readonly profile: Profile;
}

export default function ValuesCard({
  profile,
}: ValuesCardProps): React.JSX.Element {
  const { handleDownload, handlePreview } = useAssessmentActions(
    profile.valuesAssessmentPdf
  );

  return (
    <ComponentShell className="flex flex-col">
      <div className="flex flex-col w-full h-fit xs:mb-4">
        <div className="flex flex-row w-full items-center">
          <GoNorthStar strokeWidth={0.5} size={24} />
          <h1 className="text-xl font-bold ml-6 mr-auto">Values</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={"ghost"}
                size={"xsIcon"}
                aria-label="Open menu"
                className="focus:outline-none"
              >
                <GoKebabHorizontal strokeWidth={0.5} size={24} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={!profile.valuesAssessmentPdf}
                onSelect={handlePreview}
              >
                <GoEye className="mr-2 h-4 w-4" strokeWidth={0.5} />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!profile.valuesAssessmentPdf}
                onSelect={handleDownload}
              >
                <GoDownload className="mr-2 h-4 w-4" strokeWidth={0.5} />
                Download
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex w-fit h-fit flex-wrap">
        {profile.values ? (
          <div className="flex flex-wrap gap-2 xs:mt-0 mt-4">
            {profile.values?.map((value: string, index: number) => (
              <Badge
                variant="outline"
                key={index}
                className="text-base font-bold"
              >
                {value}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex w-full h-fit italic items-center text-dark3 pt-1">
            <p>No Result.</p>
          </div>
        )}
      </div>
    </ComponentShell>
  );
}
