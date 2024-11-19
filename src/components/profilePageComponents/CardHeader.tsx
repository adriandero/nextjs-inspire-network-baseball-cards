import { IconType } from "react-icons";
import { GoPerson } from "react-icons/go";

export default function CardHeader({
  title,
  icon: Icon, // Use a capitalized name for the icon to signify it’s a React component
  iconStrokeWidth,
}: {
  title: string;
  icon: IconType; // This ensures proper typing for the icon
  iconStrokeWidth: number;
}): React.JSX.Element {
  return (
    <div className="flex flex-row items-center w-fit h-fit">
      <Icon strokeWidth={iconStrokeWidth} size={24} />
      <h1 className="text-xl font-bold flex-grow w-fit ml-6">{title}</h1>
    </div>
  );
}
