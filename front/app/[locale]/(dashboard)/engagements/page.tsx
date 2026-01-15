"use client";

import { Engagement } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { use } from "react";

const data: Engagement[] = [
  {
    id: "1",
    creditLineId: "LC-2024-001",
    type: "Lettre de Crédit Documentaire",
    amount: 2500000,
    currency: "USD",
    issueDate: new Date("2024-11-01"),
    expiryDate: new Date("2025-02-28"),
    beneficiary: "Global Materials Ltd",
    status: "ACTIVE",
  },
  {
    id: "2",
    creditLineId: "LC-2024-003",
    type: "Caution de Bonne Exécution",
    amount: 1000000,
    currency: "DZD",
    issueDate: new Date("2024-12-01"),
    expiryDate: new Date("2025-06-30"),
    beneficiary: "Ministère des Travaux Publics",
    status: "PENDING",
  },
  {
    id: "3",
    creditLineId: "LC-2024-002",
    type: "Crédit Documentaire Import",
    amount: 500000,
    currency: "EUR",
    issueDate: new Date("2024-10-15"),
    expiryDate: new Date("2024-12-31"),
    beneficiary: "European Supplier SA",
    status: "COMPLETED",
  },
];

export default function EngagementsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("Engagements");
  const commonT = useTranslations("Common");

  const columns = getColumns(t, commonT, locale);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/engagements/new">
            <Button>
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable columns={columns} data={data} searchKey="beneficiary" />
      </div>
    </div>
  );
}
