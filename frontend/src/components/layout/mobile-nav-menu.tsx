"use client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import defaultAvatar from "@/public/images/default-avatar.png";

import { FiMenu } from "react-icons/fi";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/src/components/shadcn-ui/sheet";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/shadcn-ui/alert-dialog";
import { LinkButton } from "@/src/components/custom-ui/link-button";
import { UserSanity } from "@/src/lib/entities/user";

const NAV_ITEMS = [
  { href: "/", label: "Home", external: false },
  { href: "/browse", label: "Browse Cards", external: false },
  { href: "/deckbuilder", label: "Deck Builder", external: false },
  {
    href: "https://www.inspirenetworkllc.com/",
    label: "About us",
    external: true,
  },
] as const;

interface MobileNavMenuProps {
  userProfileData?: UserSanity;
  className?: string;
}

export default function MobileNavMenu({
  userProfileData,
  className,
}: MobileNavMenuProps): React.JSX.Element {
  const hasProfile = Boolean(userProfileData?.profile?.uuid);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <FiMenu
          size={32}
          strokeWidth="1.5"
          className={`text-white w-fit ml-4 !min-h-8 !min-w-8 hover:text-primary duration-200 ${className}`}
        />
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px]">
        <div className="flex h-full max-h-screen flex-col gap-2">
          {/* User Account Section */}
          <div className="flex h-fit w-full items-center border-b px-4 py-2">
            <Collapsible className="grid gap-2 w-full">
              <CollapsibleTrigger className="flex w-full justify-between items-center rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground [&[data-state=open]>svg]:rotate-90">
                <div className="flex gap-4 overflow-hidden font-medium">
                  Account
                  <Avatar className="h-full">
                    <AvatarImage
                      src={defaultAvatar.src}
                      className="rounded-full h-7 w-7 object-cover"
                    />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                </div>
                <ChevronRight className="h-5 w-5 transition-all" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="border-l ml-4">
                  {hasProfile ? (
                    <LinkButton
                      href={`/tugcards/${userProfileData?.profile?.uuid}`}
                      variant="ghost"
                      className="text-base w-full justify-start"
                    >
                      My TUG Card
                    </LinkButton>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <LinkButton
                          variant="ghost"
                          className="text-base w-full justify-start"
                        >
                          My TUG Card
                        </LinkButton>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Missing Baseball Card
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You don&apos;t have a Baseball Card assigned - Ask
                            an administrator for access
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>OK</AlertDialogCancel>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {/* Sign Out Button */}
                  <LinkButton
                    href="/auth/logout"
                    variant="ghost"
                    className="w-full !text-inspireRed justify-start text-base font-medium hover:bg-accent"
                  >
                    Sign Out
                  </LinkButton>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-base font-medium gap-1">
              {NAV_ITEMS.map((item) => (
                <LinkButton
                  key={item.href}
                  href={item.href}
                  external={item.external}
                  variant="ghost"
                >
                  {item.label}
                </LinkButton>
              ))}
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
