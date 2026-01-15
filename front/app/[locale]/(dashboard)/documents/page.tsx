"use client";

import { Document } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { use } from "react";

const data: Document[] = [
  {
    id: "1",
    name: "Contrat_LC_2024_001.pdf",
    type: "application/pdf",
    size: 2458624, // ~2.4 MB
    uploadDate: new Date("2024-12-01"),
    uploadedBy: "John Doe",
    entityType: "CREDIT_LINE",
    entityId: "LC-2024-001",
  },
  {
    id: "2",
    name: "Garantie_Hypotheque.pdf",
    type: "application/pdf",
    size: 5242880, // 5 MB
    uploadDate: new Date("2024-11-28"),
    uploadedBy: "Jane Smith",
    entityType: "CREDIT_LINE",
    entityId: "LC-2024-002",
  },
  {
    id: "3",
    name: "Bank_Agreement_BNA.docx",
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    size: 1048576, // 1 MB
    uploadDate: new Date("2024-12-05"),
    uploadedBy: "Admin",
    entityType: "BANK",
    entityId: "1",
  },
];

export default function DocumentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("Documents");
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
          <Button>
            <Upload className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
            {t("upload") || "Upload"}
          </Button>
        </div>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </div>
  );
}
