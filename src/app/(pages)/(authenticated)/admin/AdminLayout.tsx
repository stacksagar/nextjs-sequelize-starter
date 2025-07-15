"use client";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import DashboardSidebar, {
  SIDEBAR_PANEL_MENUS,
} from "@/components/layouts/DashboardSidebar";
import User from "@/models/User";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiSolidDashboard } from "react-icons/bi";
import { FaCogs, FaUsers, FaUsersCog } from "react-icons/fa";
import { FaUsersLine } from "react-icons/fa6";

const links: SIDEBAR_PANEL_MENUS = {
  Dashboard: {
    url: "/admin",
    icon: <BiSolidDashboard />,
  },

  "Users Management": {
    icon: <FaUsersCog />,
    sublinks: {
      users: {
        url: "/admin/users",
        icon: <FaUsers />,
      },
      Merchants: {
        url: "/admin/merchants",
        icon: <FaUsersLine />,
      },
    },
  },

  Settings: {
    url: "/admin/settings",
    icon: <FaCogs />,
  },
};

export default function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  // const { user } = useUser();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <DashboardSidebar links={links} opened={opened} toggle={toggle} />

      <AppShell.Main className="bg-white dark:bg-gray-900">
        <DashboardHeader user={user} opened={opened} toggle={toggle} />
        <div className="p-3 md:p-4 lg:p-5 2xl:p-6">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
