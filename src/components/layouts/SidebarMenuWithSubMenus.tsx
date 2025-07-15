import { Menu } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SIDEBAR_PANEL_MENU } from "./DashboardSidebar";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import SidebarMenu from "./SidebarMenu";
import CollapseContent from "../utilities/CollapseContent";

export default function SidebarMenuWithSubMenus({
  title,
  menu,
  toggle,
}: {
  title: string;
  menu: SIDEBAR_PANEL_MENU;
  toggle?: () => void;
}) {
  const [openMenus, setOpenMenus] = useState(true);

  return (
    <>
      <CollapseContent
        open={openMenus}
        toggler={
          <Menu.Item
            onClick={() => setOpenMenus((p) => !p)}
            className="!bg-transparent hover:!bg-indigo-50 !text-base !py-2.5 !text-neutral-700 dark:!text-gray-200 dark:hover:!bg-gray-700"
            leftSection={
              <span className="!text-lg dark:text-lightWarm">{menu?.icon}</span>
            }
            rightSection={openMenus ? <BsChevronDown /> : <BsChevronRight />}
          >
            {title}
          </Menu.Item>
        }
      >
        <div className="px-4 flex flex-col gap-y-1 mt-1">
          {Object.entries(menu?.sublinks || {})?.map(([key, submenu]) => (
            <SidebarMenu toggle={toggle} title={key} key={key} menu={submenu} />
          ))}
        </div>
      </CollapseContent>
    </>
  );
}
