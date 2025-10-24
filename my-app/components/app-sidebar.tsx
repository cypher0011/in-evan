"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconCloudDataConnectionFilled,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconUserPlus,
  IconPalette,
  IconCalendar,
  IconCreditCard,
  IconTool,
  IconGlass,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "movenpick",
    email: "movenpick@in-evan.com",
    avatar: "/avatars/movenpick.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "dashboard",
      icon: IconDashboard,
    },
    // {
    //   title: "Add New Guest",
    //   url: "#",
    //   icon: IconUserPlus,
    // },
    {
      title: "Guests",
      url: "/guests",
      icon: IconUsers
    },
    {
      title: "Mini Bar",
      url: "/Minibar",
      icon: IconGlass,
      items: [
        {
          title: "Add New Item",
          url: "#",
        },
        {
          title: "Edit",
          url: "#",
        },
        {
          title: "Upload Picture",
          url: "#",
        },
      ],
    },
    {
      title: "feedback",
      url: "/feedback",
      icon: IconListDetails,
      items: [
        {
          title: "What Type",
          url: "#",
        },
      ],
    },
    {
      title: "guest app",
      url: "/guest-app",
      icon: IconCalendar,
      items: [
        {
          title: "What Type",
          url: "#",
        },
      ],
    },
    // finish later 
    // {
    //   title: "Style",
    //   url: "#",
    //   icon: IconPalette,
    //   items: [
    //     {
    //       title: "Guest",
    //       url: "#",
    //     },
    //     {
    //       title: "Mini-Bar",
    //       url: "#",
    //     },
    //     {
    //       title: "Checkin",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Payments",
    //   url: "#",
    //   icon: IconCreditCard,
    //   items: [
    //     {
    //       title: "Cash",
    //       url: "#",
    //     },
    //     {
    //       title: "Visa",
    //       url: "#",
    //     },
    //     {
    //       title: "Apple Pay",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Operation",
    //   url: "#",
    //   icon: IconTool,
    //   items: [
    //     {
    //       title: "Cleaning Room",
    //       url: "#",
    //     },
    //     {
    //       title: "Mini Bar Stuff",
    //       url: "#",
    //     },
    //     {
    //       title: "Dining in the Room",
    //       url: "#",
    //     },
    //   ],
    // },
        {
      title: "Analysis",
      url: "/analysis",
      icon: IconCloudDataConnectionFilled,
      items: [
        {
          title: "Cleaning Room",
          url: "#",
        },
        {
          title: "Mini Bar Stuff",
          url: "#",
        },
        {
          title: "Dining in the Room",
          url: "#",
        },
      ],
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Evan Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
