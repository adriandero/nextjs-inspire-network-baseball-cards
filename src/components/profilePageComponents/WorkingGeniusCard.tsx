import Image from "next/image";

import { GoLightBulb } from "react-icons/go";

import widgetimage from "@/../public/widgetIllustrations/WIDGET1.png";

export default function WorkingGeniusCard({ profile }: any): React.JSX.Element {
  return (
    <div className="max-w-2xl w-full h-fit border border-light3 rounded-2xl p-8 flex-col mt-6">
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
        <Image src={widgetimage} alt="Picture of the author" width={390} />
      </div>
    </div>
  );
}
