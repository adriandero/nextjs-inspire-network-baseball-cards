import { GoPerson } from "react-icons/go";
import { TableCell, TableRow } from "../ui/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export default function ProfileTableRow({ profile }: any): React.JSX.Element {
  return (
    <div className="w-full h-12 border border-light3 rounded-2xl flex ">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex justify-between items-center w-full">
        <div className="p-8">name</div>
        <div className="p-8">name</div>
        <div className="p-8">name</div>
      </div>
    </div>
  );
}
