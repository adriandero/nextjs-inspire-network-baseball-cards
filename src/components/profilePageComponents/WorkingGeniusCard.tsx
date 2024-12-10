"use client";

import { GoLightBulb } from "react-icons/go";

import WidgetCogsSVG from "@/components/profilePageComponents/WidgetCogsSVG";

import { SanityDocument } from "next-sanity";
import ComponentShell from "./ComponentShell";

export default function WorkingGeniusCard({
  profile,
}: SanityDocument): React.JSX.Element {

  console.log(profile.workingGenius.widget);
  return (
    <ComponentShell>
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
          <h3 className="font-bold mt-2">{profile.workingGenius.title}</h3>
          <p className="">{profile.workingGenius.description}</p>
        </div>
      </div>
      <div className="h-px w-full bg-light3 my-6"></div>
      <div className="flex justify-center">
        <WidgetCogsSVG
          widget={profile.workingGenius.widget}
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
