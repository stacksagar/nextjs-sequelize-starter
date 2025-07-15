"use client";
import DashboardHeader from "@/components/layouts/DashboardHeader";
import DashboardSidebar from "@/components/layouts/DashboardSidebar";
import User from "@/models/User";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function layout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <DashboardSidebar opened={opened} toggle={toggle} />

      <AppShell.Main className="bg-white dark:bg-gray-900">
        <DashboardHeader
          user={user}
          opened={opened}
          toggle={toggle}
          isMerchant
        />
        <div className="p-3 md:p-4 lg:p-5 2xl:p-6 !pb-20">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
