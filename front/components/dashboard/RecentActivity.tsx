"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

export function RecentActivity() {
  const t = useTranslations("Dashboard.activities");

  const activities = [
    {
      user: "Sarah Lane",
      email: "sarah.lane@gestion-lc.com",
      action: t("createdCreditLine", { bank: "BNA" }),
      date: t("hoursAgo", { count: 2 }),
      avatar: "/images/avatar-1.png",
      initials: "SL",
    },
    {
      user: "Michael Chen",
      email: "m.chen@gestion-lc.com",
      action: t("updatedStatus", { bank: "BEA", status: "Utilized" }),
      date: t("hoursAgo", { count: 4 }),
      avatar: "/images/avatar-2.png",
      initials: "MC",
    },
    {
      user: "Emma Wilson",
      email: "e.wilson@gestion-lc.com",
      action: t("approvedSupplier"),
      date: t("hoursAgo", { count: 5 }),
      avatar: "/images/avatar-3.png",
      initials: "EW",
    },
    {
      user: "James Bond",
      email: "j.bond@gestion-lc.com",
      action: t("exportedReport"),
      date: t("dayAgo"),
      avatar: "/images/avatar-4.png",
      initials: "JB",
    },
  ];

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.avatar} alt="Avatar" />
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 rtl:mr-4 rtl:ml-0">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">{activity.action}</p>
          </div>
          <div className="ml-auto font-medium text-xs text-muted-foreground rtl:mr-auto rtl:ml-0">
            {activity.date}
          </div>
        </div>
      ))}
    </div>
  );
}
