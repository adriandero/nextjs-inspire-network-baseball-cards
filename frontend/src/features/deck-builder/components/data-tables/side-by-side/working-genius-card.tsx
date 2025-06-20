import { SanityDocument } from "next-sanity";

import { GoLightBulb } from "react-icons/go";
import workingGeniusJson from "@/public/json/working-genius.json";
import WidgetCogsSVG from "@/public/illustrations/widget-cogs-svg";

export default function WorkingGeniusCard({
  profile,
}: SanityDocument): React.JSX.Element {
  type workingGeniusKey = keyof typeof workingGeniusJson;

  const workingGenius: workingGeniusKey = profile.workingGenius?.title;
  return (
    <div className="w-full h-fit border border-light3 bg-background rounded-2xl p-4">
      {workingGeniusJson[workingGenius] ? (
        <div className="flex flex-col">
          <div className="flex items-center mr-4 h-full">
            <GoLightBulb strokeWidth={0.5} size={20} className="mr-4" />
            <h2 className="text-lg font-bold">Working Genius</h2>
          </div>
          <div className="flex flex-col w-fit h-fit items-start">
            <h3 className="font-bold text-base mt-2">
              {workingGeniusJson[workingGenius]?.title}
            </h3>
            <p className="text-sm">{workingGeniusJson[workingGenius]?.description}</p>
          </div>
        </div>
      ) : (
        <div className="flex w-full h-fit justify-center items-center italic text-dark3">
          {" "}
          <p>No Result.</p>
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
    </div>
  );
}
