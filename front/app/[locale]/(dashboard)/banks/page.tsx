"use client";

import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useEffect, useState, useOptimistic, startTransition } from "react";
import { BanksService } from "@/lib/services/banks.service";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslations } from "next-intl";
import { Banque } from "@/lib/types/models";
import { toast } from "sonner";

export default function BanksPage() {
  const t = useTranslations("Banks");
  const commonT = useTranslations("Common");
  const router = useRouter();
  const [banks, setBanks] = useState<Banque[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [optimisticBanks, removeOptimisticBank] = useOptimistic(
    banks,
    (state, idToRemove: string) => {
      return state.filter((bank) => bank.id !== idToRemove);
    }
  );

  const handleDelete = async (bank: Banque) => {
    if (!confirm(t("deleteConfirm"))) {
      return;
    }

    startTransition(async () => {
      removeOptimisticBank(bank.id);
      try {
        await BanksService.deleteBank(bank.id);
        toast.success(t("deleteSuccess"));
        // Update the actual state to match the optimistic state persistently
        setBanks((prev) => prev.filter((b) => b.id !== bank.id));
      } catch (error: any) {
        toast.error(error.message || t("deleteFailed"));
        // No need to manually revert; when transition ends, if we didn't update 'banks',
        // optimisticBanks will revert to the original 'banks'.
      }
    });
  };

  const columns = getColumns(t, router, handleDelete);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching banks...");
      const data = await BanksService.getBanks();
      console.log("Banks data received:", data);
      setBanks(data);
    } catch (err: any) {
      setError(err.message || commonT("error"));
      console.error("Error loading banks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/banks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>

      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">{t("loading")}</span>
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
                className="ml-4"
                onClick={fetchBanks}
              >
                {t("retry")}
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <DataTable columns={columns} data={optimisticBanks} searchKey="nom" />
        )}
      </div>
    </div>
  );
}
