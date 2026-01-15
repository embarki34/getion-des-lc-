"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Users,
  Briefcase,
  Truck,
  ShieldCheck,
  FileText,
  Settings,
  PieChart,
  FileBadge,
  MessageSquare,
  Lock,
  Search,
  HelpCircle,
} from "lucide-react"

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
import { useTranslations } from "next-intl"
import { usePathname } from "@/i18n/routing"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("Sidebar")
  const pathname = usePathname()

  const data = {
    user: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatars/john.jpg",
    },
    navMain: [
      {
        title: t("dashboard"),
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: pathname === "/dashboard",
      },
      {
        title: t("banks"),
        url: "/banks",
        icon: Building2,
        isActive: pathname.startsWith("/banks"),
      },
      {
        title: t("creditLines"),
        url: "/credit-lines",
        icon: CreditCard,
        isActive: pathname.startsWith("/credit-lines"),
      },
      {
        title: t("companies"),
        url: "/companies",
        icon: Briefcase,
        isActive: pathname.startsWith("/companies"),
      },
      {
        title: t("businessUnits"),
        url: "/business-units",
        icon: Building2,
        isActive: pathname.startsWith("/business-units"),
      },
      {
        title: t("suppliers"),
        url: "/suppliers",
        icon: Truck,
        isActive: pathname.startsWith("/suppliers"),
      },
      {
        title: t("users"),
        url: "/users",
        icon: Users,
        isActive: pathname.startsWith("/users"),
      },
      {
        title: t("roles"),
        url: "/roles",
        icon: Lock,
        isActive: pathname.startsWith("/roles"),
      },
      {
        title: t("guarantees"),
        url: "/guarantees",
        icon: ShieldCheck,
        isActive: pathname.startsWith("/guarantees"),
      },
      {
        title: t("engagements"),
        url: "/engagements",
        icon: FileBadge,
        isActive: pathname.startsWith("/engagements"),
      },
      {
        title: t("swiftMessages"),
        url: "/swift-messages",
        icon: MessageSquare,
        isActive: pathname.startsWith("/swift-messages"),
      },
      {
        title: t("documents"),
        url: "/documents",
        icon: FileText,
        isActive: pathname.startsWith("/documents"),
      },
      {
        title: t("reports"),
        url: "/reports",
        icon: PieChart,
        isActive: pathname.startsWith("/reports"),
      },
    ],
    navSecondary: [
      {
        title: t("settings"),
        url: "/system/audit-logs",
        icon: Settings,
        isActive: pathname.startsWith("/system/audit-logs"),
      },
      {
        title: "Search",
        url: "#",
        icon: Search,
      },
      {
        title: "Help",
        url: "#",
        icon: HelpCircle,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props} className="border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Briefcase className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold uppercase tracking-tight">Gestion LC</span>
                  <span className="truncate text-xs text-muted-foreground">Admin Portal</span>
                </div>
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
