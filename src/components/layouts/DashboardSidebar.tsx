import { AppShell,   Menu } from "@mantine/core";
import React from "react";
import Link from "next/link";
import SearchInput from "@/components/common/forms/SearchInput";
import {
  BiChart, 
  BiChevronRight,
  BiGift,
  BiHistory,
  BiSolidDashboard, 
} from "react-icons/bi";
import {
  FaCogs,
  FaFileAlt,
  FaMoneyBill, 
  FaShoppingCart,
  FaTruck,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";
import { FaFile, FaUsersLine } from "react-icons/fa6";
import { BsUiChecksGrid } from "react-icons/bs";
import SidebarMenuWithSubMenus from "./SidebarMenuWithSubMenus";
import SidebarMenu from "./SidebarMenu";
import { MessageCircle } from "lucide-react";
import NavbarSwitchPlain from "../utilities/NavbarSwitchPlain";

export interface SIDEBAR_PANEL_MENU {
  icon: React.ReactNode | string;
  url?: string;
  newTab?: boolean;
  sublinks?: SIDEBAR_PANEL_MENUS;
}

interface SIDEBAR_PANEL_MENUS {
  [key: string]: SIDEBAR_PANEL_MENU;
}

const links: SIDEBAR_PANEL_MENUS = {
  Dashboard: {
    url: "/admin",
    icon: <BiSolidDashboard />,
  },

  "Users Management": {
    icon: <FaUsersCog />,
    sublinks: {
      Customers: {
        url: "/admin/customers",
        icon: <FaUsers />,
      },
      Merchants: {
        url: "/admin/merchants",
        icon: <FaUsersLine />,
      },
    },
  },

  "Deals Management": {
    icon: <FaFileAlt />,
    sublinks: {
      Deals: {
        url: "/admin/deals",
        icon: <FaFile />,
      },
      Orders: {
        url: "/admin/orders",
        icon: <FaShoppingCart />,
      },
    },
  },

  "Delivery Personnel": {
    icon: <FaFileAlt />,
    sublinks: {
      Personnel: {
        url: "/admin/delivery-personnels",
        icon: <FaUsers />,
      },
      Deliveries: {
        url: "/admin/personnel-deliveries",
        icon: <FaTruck />,
      },
    },
  },

  "Merchant Withdraws": {
    url: "/admin/merchant-withdraws",
    icon: <FaMoneyBill />,
  },

  "Redemption Cards": {
    url: "/admin/redemption-cards",
    icon: <BiGift />,
  },

  Transactions: {
    url: "/admin/transactions",
    icon: <BiHistory />,
  },

  // "Fraud Detection": {
  //   url: "/admin/fraud-detection",
  //   icon: <BiCheckShield />,
  // },

  "Complaint Management": {
    url: "/admin/complaint-management",
    icon: <BsUiChecksGrid />,
  },

  "Reports & Analytics": {
    url: "/admin/reports-and-analytics",
    icon: <BiChart />,
  },

  Messages: {
    url: "/messages",
    icon: <MessageCircle />,
  },

  Settings: {
    url: "/admin/settings",
    icon: <FaCogs />,
  },
};

export default function DashboardSidebar({
  toggle,
  opened,
}: {
  opened?: boolean;
  toggle: () => void;
}) {
  return (
    <AppShell.Navbar className="!border-[#EFEFEF] dark:!border-gray-800 dark:!bg-darkMinimalism">
      {/* header area */}
      <div className="px-2">
        <div className="flex items-center justify-between">
          <Link href="/" target="_blank">
            <img
              className="h-[90px] hidden dark:block"
              src="/brand/kuponna-brand-white-yellow.png"
              alt=""
            />
            <img
              className="h-[90px] block dark:hidden"
              src="/brand/kuponna-brand-primary.png"
              alt=""
            />
          </Link>

          <div className="md:hidden">
            <NavbarSwitchPlain
              onChange={() => toggle()}
              checked={opened ? true : false}
            />
          </div>
        </div>

        <div className="py-3">
          <SearchInput
            placeholder="Search sub-account"
            className="sm:!h-12 !border-[#EFEFEF] dark:!border-gray-800"
          />
        </div>
      </div>

      {/* menus area */}
      <div className="px-2 pt-1 w-full h-full overflow-y-auto scroll-thin">
        <Menu>
          <div className="flex flex-col gap-y-1">
            {/* links */}
            {Object.entries(links)?.map(([key, menu]) =>
              menu?.sublinks ? (
                <SidebarMenuWithSubMenus
                  toggle={toggle}
                  key={key}
                  title={key}
                  menu={menu}
                />
              ) : (
                <SidebarMenu
                  toggle={toggle}
                  key={key}
                  title={key}
                  menu={menu}
                />
              )
            )}
          </div>
        </Menu>

        {/* Helpline Footer */}
        <SidebarFooterContactBtn />
      </div>
    </AppShell.Navbar>
  );
}

const SidebarFooterContactBtn = () => (
  <Link
    href="/contact"
    target="_blank"
    className="px-1.5 py-3 my-3 bg-neutral-100 dark:bg-gray-900 rounded-2xl outline-1 outline-offset-[-1px] outline-gray-200 gap-2.5 overflow-hidden flex justify-between items-center"
  >
    <div className="w-12 h-12 p-2.5 bg-white rounded-3xl shadow-[0px_0.7512931227684021px_3.6312501430511475px_0px_rgba(89,108,148,0.04)] inline-flex justify-start items-center gap-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
      >
        <path
          d="M20.9984 9.80078V12.6008C20.9984 14.086 20.4084 15.5104 19.3582 16.5606C18.308 17.6108 16.8836 18.2008 15.3984 18.2008H13.7576L11.2852 20.6746C11.6772 20.8832 12.1238 21.0008 12.5984 21.0008H15.3984L19.5984 25.2008V21.0008H22.3984C23.141 21.0008 23.8532 20.7058 24.3783 20.1807C24.9034 19.6556 25.1984 18.9434 25.1984 18.2008V12.6008C25.1984 11.8582 24.9034 11.146 24.3783 10.6209C23.8532 10.0958 23.141 9.80078 22.3984 9.80078H20.9984Z"
          fill="#5676FF"
        />
        <path
          d="M2.80078 6.99922C2.80078 6.25661 3.09578 5.54442 3.62088 5.01932C4.14598 4.49422 4.85818 4.19922 5.60078 4.19922H15.4008C16.1434 4.19922 16.8556 4.49422 17.3807 5.01932C17.9058 5.54442 18.2008 6.25661 18.2008 6.99922V12.5992C18.2008 13.3418 17.9058 14.054 17.3807 14.5791C16.8556 15.1042 16.1434 15.3992 15.4008 15.3992H12.6008L8.40078 19.5992V15.3992H5.60078C4.85818 15.3992 4.14598 15.1042 3.62088 14.5791C3.09578 14.054 2.80078 13.3418 2.80078 12.5992V6.99922Z"
          fill="#060ACD"
        />
      </svg>
    </div>

    <div className="space-y-1 pl-1 mr-auto">
      <div className="self-stretch justify-start  text-base font-bold leading-tight">
        Help Center
      </div>

      <div className="self-stretch justify-start text-sm font-normal leading-none">
        Answers here
      </div>
    </div>

    <BiChevronRight />
  </Link>
);
