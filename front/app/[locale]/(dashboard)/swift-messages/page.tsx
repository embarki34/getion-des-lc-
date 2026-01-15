"use client";

import { SwiftMessage } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { use } from "react";

const data: SwiftMessage[] = [
  {
    id: "1",
    reference: "MT700-2024-001",
    type: "MT700",
    direction: "OUTGOING",
    bankId: "BNA",
    date: new Date("2024-12-08T10:30:00"),
    status: "PROCESSED",
    contentPreview: "Documentary Credit Issuance - Global Materials Ltd...",
  },
  {
    id: "2",
    reference: "MT707-2024-045",
    type: "MT707",
    direction: "INCOMING",
    bankId: "BEA",
    date: new Date("2024-12-07T14:15:00"),
    status: "PROCESSED",
    contentPreview: "Amendment to Documentary Credit LC-2024-003...",
  },
  {
    id: "3",
    reference: "MT760-2024-012",
    type: "MT760",
    direction: "OUTGOING",
    bankId: "CPA",
    date: new Date("2024-12-09T09:00:00"),
    status: "PENDING",
    contentPreview: "Guarantee Issuance - Caution de Bonne Exécution...",
  },
];

export default function SwiftMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("SwiftMessages");
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
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {t("import") || "Import"}
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {commonT("export")}
          </Button>
        </div>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable columns={columns} data={data} searchKey="reference" />
      </div>
    </div>
  );
}
