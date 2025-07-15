import SearchInput from "@/components/common/forms/SearchInput";
import React from "react";

import Link from "next/link";
import User from "@/models/User";
import ThemeToggle from "../theme/ThemeToggle";
import NavbarSwitchPlain from "../utilities/NavbarSwitchPlain";
export default function DashboardHeader({
  opened,
  toggle,
  user,
  isMerchant,
}: {
  opened?: boolean;
  toggle: () => void;
  user?: User;
  isMerchant?: boolean;
}) {
  return (
    <header className="bg-white dark:bg-darkMinimalism !duration-0 border-b dark:border-gray-800 border-b-[#EFEFEF]">
      <div className="w-full h-[80px] px-4 md:px-8 lg:px-9 flex items-center justify-between">
        <div className="md:hidden flex items-center">
          <NavbarSwitchPlain
            onChange={() => toggle()}
            checked={opened ? true : false}
          />

          <Link href="/" target="_blank" className="flex items-center gap-x-4">
            <img
              className="max-w-[124px] dark:hidden"
              src="/brand/kuponna-brand-primary.png"
              alt=""
            />

            <img
              className="max-w-[124px] hidden dark:block"
              src="/brand/kuponna-brand-white-yellow.png"
              alt=""
            />
          </Link>
        </div>

        <div className="hidden xl:block justify-start  text-xl font-bold leading-loose dark:text-gray-300">
          <span className="font-semibold">Hello </span> {user?.name}
        </div>

        <div className="hidden lg:block">
          <SearchInput className="sm:!h-12 !border-[#EFEFEF] dark:!border-gray-800" />
        </div>

        <div className="flex items-center gap-x-3 sm:gap-x-6 xl:gap-x-9 ml-auto lg:ml-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
