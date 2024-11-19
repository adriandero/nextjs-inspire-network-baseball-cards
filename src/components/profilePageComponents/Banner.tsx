import { GoPerson } from "react-icons/go";

export default function Banner({ profile }: any): React.JSX.Element {
  return (
    <div className="w-full h-48 bg-secondary rounded-2xl flex items-center">
      <div className="w-32 h-32 rounded-full bg-light3 ml-20 mr-12 flex justify-center items-center">
        <GoPerson className="text-6xl text-dark3" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-light1">{profile.name}</h1>
        <h1 className="text-2xl font-bold text-primary">{profile.jobRole}</h1>
      </div>
    </div>
  );
}
