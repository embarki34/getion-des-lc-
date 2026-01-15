"use client";

import { Guarantee } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import { GuaranteesService } from "@/lib/services/guarantees.service";

const GuaranteesPage = ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = use(params);
  const t = useTranslations("Guarantees");
  const commonT = useTranslations("Common");
  const [guarantees, setGuarantees] = useState<Guarantee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGuarantees = async () => {
      try {
        const response = await GuaranteesService.getGuarantees();
        // Ensure data is array
        const list = Array.isArray(response) ? response : [];
        setGuarantees(list);
      } catch (err) {
        console.error("Failed to fetch guarantees:", err);
        setError("Failed to load guarantees");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuarantees();
  }, []);

  const columns = getColumns(t, commonT, locale);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        {/* Create button removed as per requirement */}
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            {error}
          </div>
        ) : (
          <DataTable columns={columns} data={guarantees} searchKey="type" />
        )}
      </div>
    </div>
  );
}

export default GuaranteesPage;
