"use client";

import { GoLightBulb } from "react-icons/go";

import WidgetCogsSVG from "@/public/illustrations/widget-cogs-svg";
import workingGeniusJson from "@/public/json/working-genius.json";

import ComponentShell from "../../components/custom-ui/component-shell";
import { Profile } from "@/src/shared/entities/profile";

interface WorkingGeniusCardProps {
  readonly profile: Profile;
}

export default function WorkingGeniusCard({
  profile,
}: WorkingGeniusCardProps): React.JSX.Element {
  const workingGenius = profile.workingGenius?.title;

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
            <h2 className="text-xl font-bold">Working Genius</h2>
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
