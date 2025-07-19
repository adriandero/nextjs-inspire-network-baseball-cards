"use client";

import Link from "next/link";
import Image from "next/image";
import INTMLogo from "@/public/images/in-tug-card-logo.png";
import MobileNavMenu from "./mobile-nav-menu";

import { NAV_ITEMS } from "@/src/constants/navigation";
import AccountDropdown from "@/src/components/custom-ui/account-dropdown";
import { UserSanity } from "@/src/lib/entities/user";

interface NavBarProps {
  userProfileData?: UserSanity;
}

export default function NavBar({
  userProfileData,
}: NavBarProps): React.JSX.Element {
  return (
    <div className="w-full h-16 flex items-center justify-self-center px-2 sm:px-6">
      {/* Logo */}
      <Link href="/" className="mr-auto">
        <Image
          src={INTMLogo}
          width={70}
          height={150}
          alt="Company Logo"
          className=""
        />
      </Link>

      <MobileNavMenu
        userProfileData={userProfileData?.profile}
        className="md:hidden !text-dark1"
      />

      <div className="hidden md:flex space-x-12 text-lg h-full items-center font-medium">
        {NAV_ITEMS.slice()
          .reverse()
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-primary duration-200"
              {...(item.external && {
                target: "_blank",
                rel: "noopener noreferrer",
              })}
            >
              {item.label}
            </Link>
          ))}

        <AccountDropdown userProfileData={userProfileData} />
      </div>
    </div>
  );
}
