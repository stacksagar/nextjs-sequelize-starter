import Link from "next/link";
import React from "react";
import { SIDEBAR_PANEL_MENU } from "./AdminPanelSidebar";
import { Menu } from "@mantine/core";
import useIsActivePath from "@/hooks/useIsActivePath";

export default function SidebarMenu({
  title,
  menu,
  toggle,
}: {
  title: string;
  menu: SIDEBAR_PANEL_MENU;
  toggle?: () => void;
}) {
  const { isActive } = useIsActivePath(menu?.url);

  return (
    <Link
      onClick={() =>
        setTimeout(() => {
          toggle && toggle();
        }, 150)
      }
      href={menu?.url || "#"}
      target={menu?.newTab ? "_blank" : "_self"}
    >
      <Menu.Item
        className={`!border ${
          isActive
            ? "!bg-indigo-50 !text-blue-800 !border-indigo-200 dark:!bg-gray-700 dark:!text-lightWarm"
            : "!bg-transparent hover:!bg-indigo-50 dark:hover:!bg-gray-700 !border-transparent !text-neutral-600 dark:!text-gray-200"
        } !text-base !py-2.5`}
        leftSection={<span className="!text-lg">{menu?.icon}</span>}
      >
        {title}
      </Menu.Item>
    </Link>
  );
}
