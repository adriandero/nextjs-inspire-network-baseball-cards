"use client";

import {
  GoDownload,
  GoKebabHorizontal,
  GoLightBulb,
  GoEye,
} from "react-icons/go";

import WidgetCogsSVG from "@/public/illustrations/widget-cogs-svg";
import workingGeniusJson from "@/public/json/working-genius.json";

import ComponentShell from "../../components/custom-ui/component-shell";
import { Button } from "@/src/components/shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/shadcn-ui/dropdown-menu";
import { Profile } from "@/src/shared/entities/profile.types";
import { useAssessmentActions } from "@/src/hooks/profile/use-assessment-action";

interface WorkingGeniusCardProps {
  readonly profile: Profile;
}

export default function WorkingGeniusCard({
  profile,
}: WorkingGeniusCardProps): React.JSX.Element {
  const workingGenius = profile.workingGenius?.title;
  const { handleDownload, handlePreview } = useAssessmentActions(
    profile.workingGeniusAssessmentPdf
  );

  return (
    <ComponentShell>
      {workingGenius && workingGeniusJson[workingGenius] ? (
        <div className="flex flex-row">
          <div className="h-full mr-6">
            <GoLightBulb
              strokeWidth={0.5}
              size={24}
              className="flex self-start"
            />
          </div>
          <div className="flex flex-col w-fit h-fit items-start">
            <div className="flex w-full">
              <h2 className="text-xl font-bold mr-auto">Working Genius</h2>
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
                    disabled={!profile.workingGeniusAssessmentPdf}
                    onSelect={handlePreview}
                  >
                    <GoEye className="mr-2 h-4 w-4" strokeWidth={0.5} />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!profile.workingGeniusAssessmentPdf}
                    onSelect={handleDownload}
                  >
                    <GoDownload className="mr-2 h-4 w-4" strokeWidth={0.5} />
                    Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <h3 className="font-bold mt-2">
              {workingGeniusJson[workingGenius]?.title}
            </h3>
            <p className="">{workingGeniusJson[workingGenius]?.description}</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-fit items-center italic text-dark3">
          {" "}
          <p className="ml-10">No Result.</p>
        </div>
      )}
      <div className="h-px w-full bg-light3 my-6"></div>
      <div className="flex justify-center">
        <WidgetCogsSVG
          widget={profile.workingGenius?.widget}
          _id={""}
          _rev={""}
          _type={""}
          _createdAt={""}
          _updatedAt={""}
        />
      </div>
    </ComponentShell>
  );
}
