"use client";

import * as React from "react";
import { BusinessUnit } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BusinessUnitsService } from "@/lib/services/business-units.service";
import { toast } from "sonner";

export default function BusinessUnitsPage() {
  const t = useTranslations("BusinessUnits");
  const commonT = useTranslations("Common");
  const usersT = useTranslations("Users");
  const suppliersT = useTranslations("Suppliers");

  const [data, setData] = React.useState<BusinessUnit[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const units = await BusinessUnitsService.getBusinessUnits();
      setData(units);
    } catch (err) {
      console.error(err);
      setError("Failed to load business units");
      toast.error("Failed to load business units");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = React.useCallback(async (id: string, name: string) => {
    // Optimistic update
    const previousData = [...data];
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.info(`Deleting ${name}...`);

    try {
      await BusinessUnitsService.deleteBusinessUnit(id);
      toast.success(`${name} deleted successfully`);
    } catch (error: any) {
      // Revert on error
      setData(previousData);
      toast.error(error.message || `Failed to delete ${name}`);
    }
  }, [data]);

  // We need to pass handleDelete to columns if we want delete functionality in the dropdown
  // Assuming getColumns can be updated or we need to check columns.tsx
  // For now, I will use getColumns as is, but if delete is needed in columns, I will need to update it.
  // Looking at previous patterns, columns.tsx likely needs an update if we want real actions.
  // I will pass handleDelete to getColumns assuming I will update columns.tsx next or it's already there (it wasn't in previous view)
  const columns = React.useMemo(() => getColumns(t, commonT, usersT, suppliersT, handleDelete), [t, commonT, usersT, suppliersT, handleDelete]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchData} variant="outline">
          {commonT("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/business-units/new">
            <Button>
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        <DataTable columns={columns} data={data} searchKey="name" />
      </div>
    </div>
  );
}
