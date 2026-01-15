"use client";

import {
  CreditCard,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Building,
  Clock,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Overview } from "@/components/dashboard/Overview";
import { useTranslations } from "next-intl";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("export")}
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t("newCreditLine")}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("totalCreditLines")}
          value="24"
          icon={CreditCard}
          description={t("activeLines")}
          trend="+12%"
          trendUp={true}
        />
        <StatCard
          title={t("totalAuthorized")}
          value="45M DZD"
          icon={DollarSign}
          description={t("acrossBanks")}
          trend="+4%"
          trendUp={true}
        />
        <StatCard
          title={t("totalConsumption")}
          value="12.5M DZD"
          icon={TrendingUp}
          description={t("ofAuthorized")}
          trend="-2%"
          trendUp={false}
        />
        <StatCard
          title={t("activeBanks")}
          value="7"
          icon={Building}
          description={t("partnerInstitutions")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>{t("utilization")}</CardTitle>
            <CardDescription>{t("utilizationDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>{t("recentActivity")}</CardTitle>
            <CardDescription>
              {t("recentActivityDesc", { count: 265 })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("expiringSoon")}</CardTitle>
            <CardDescription>{t("expiringSoonDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="text-2xl font-bold">3</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("outstandingAmount")}</CardTitle>
            <CardDescription>{t("outstandingAmountDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div className="text-2xl font-bold text-red-600">8.2M DZD</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
