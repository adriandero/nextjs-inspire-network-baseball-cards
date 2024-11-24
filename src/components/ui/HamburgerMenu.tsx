import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

type props = {
  className?: string; // Optional for extra styling
};

export default function HamburgerMenu({ className }: props): React.JSX.Element {
  return (
    <div className={className}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <FiMenu size={30} strokeWidth="1.5" className="text-white mr-4" />

            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <div className="grid gap-2 py-6">
            <Link
              href="/profiles"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Home
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Teams
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              Assessment
            </Link>
            <Link
              href="#"
              className="flex w-full items-center py-2 text-lg font-semibold"
              prefetch={false}
            >
              <h1 className="flex flex-row items-center gap-2">
                <Avatar className="h-full">
                  <AvatarImage
                    src={"/defaultAvatar.png"}
                    className="rounded-full h-8"
                  />
                </Avatar>
                Profile
              </h1>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
