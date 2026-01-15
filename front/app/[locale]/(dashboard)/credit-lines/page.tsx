"use client";

import { useEffect, useState, use, useOptimistic, startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { DataTable } from "@/components/tables/DataTable";
import { getColumns } from "./columns";
import { CreditLine } from "@/lib/types/models";
import { CreditLinesService } from "@/lib/services/credit-lines.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export default function CreditLinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  const t = useTranslations("CreditLines");
  const commonT = useTranslations("Common");
  const [data, setData] = useState<CreditLine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [optimisticData, removeOptimisticLine] = useOptimistic(
    data,
    (state, idToRemove: string) => {
      return state.filter((line) => line.id !== idToRemove);
    }
  );

  const handleDelete = async (line: CreditLine) => {
    if (!confirm(commonT("confirm"))) return;

    startTransition(async () => {
      removeOptimisticLine(line.id);
      try {
        await CreditLinesService.deleteCreditLine(line.id);
        toast.success(commonT("success"));
        // Update the actual state to match the optimistic state persistently
        setData((prev) => prev.filter((l) => l.id !== line.id));
      } catch (error) {
        toast.error(commonT("error"));
        // No need to revert manually; optimistic state will sync back to 'data' if 'data' wasn't updated.
      }
    });
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await CreditLinesService.getCreditLines();
      setData(result);
    } catch (err: any) {
      setError(err.message || t("loadingFailed"));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = getColumns(t, commonT, locale, handleDelete);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/credit-lines/new">
            <Button>
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{commonT("error")}</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="mt-2 block"
            >
              {t("retry") || "Retry"}
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <DataTable columns={columns} data={optimisticData} searchKey="no" />
      )}
    </div>
  );
}
