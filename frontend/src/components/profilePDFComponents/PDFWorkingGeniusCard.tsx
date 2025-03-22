import { GoLightBulb } from "react-icons/go";
import { SanityDocument } from "next-sanity";
import WidgetCogsSVG from "../profilePageComponents/WidgetCogsSVG";
import workingGeniusJson from "../../../public/workingGenius.json";

export default function PDFWorkingGeniusCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  type workingGeniusKey = keyof typeof workingGeniusJson;

  const workingGenius: workingGeniusKey = profile.workingGenius?.title;

  return (
    <div className={`${className} flex  gap-4`}>
      <div className="flex flex-row h-full w-1/2">
        <div className="h-full mr-6">
          <GoLightBulb
            strokeWidth={0.5}
            size={22}
            className="flex self-start mt-0.5"
          />
        </div>
        <div className="flex flex-col min-w-32 min-h-full items-start">
          <h2 className="text-lg font-bold">Working Genius</h2>
          <h3 className="font-bold mt-2 text-base">
            {workingGeniusJson[workingGenius].title}
          </h3>
          <p className="text-base">
            {workingGeniusJson[workingGenius].description}
          </p>
        </div>
      </div>

      <div className="flex justify-center w-1/2 max-h-48">
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
