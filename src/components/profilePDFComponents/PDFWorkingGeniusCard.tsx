import { GoLightBulb } from "react-icons/go";

import Image from "next/image";

import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";
import { SanityDocument } from "next-sanity";

export default function PDFWorkingGeniusCard({
  profile,
  className,
}: SanityDocument): React.JSX.Element {
  return (
    <div className={`${className} flex items-center gap-4`}>
      <div className="flex flex-row w-full h-full">
        <div className="h-full mr-6">
          <GoLightBulb
            strokeWidth={0.5}
            size={22}
            className="flex self-start mt-0.5"
          />
        </div>
        <div className="flex flex-col min-w-32 min-h-full items-start">
          <h2 className="text-lg font-bold">Working Genius</h2>
          <h3 className="font-bold mt-2">{profile.workingGenius.title}</h3>
          <p className="">{profile.workingGenius.description}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Image
          src={widgetimage}
          alt="Illustration of the WIDGET gears"
          width={600}
        />
      </div>
    </div>
  );
}
