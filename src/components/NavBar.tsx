import { GoArrowLeft } from "react-icons/go";

export default function NavBar(): React.JSX.Element {
  return (
    <div className="w-full h-16 flex justify-between items-center justify-self-center px-6">
      <GoArrowLeft size={32} strokeWidth="0" />
      <div className="flex space-x-12 text-xl">
        <h1>Home</h1>
        <h1>Teams</h1>
        <h1>Assessment</h1>
        <h1>Profile</h1>
      </div>
    </div>
  );
}
