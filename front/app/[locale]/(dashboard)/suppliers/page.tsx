"use client";

import * as React from "react";
import { Supplier } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SuppliersService } from "@/lib/services/suppliers.service";
import { toast } from "sonner";

export default function SuppliersPage() {
  const t = useTranslations("Suppliers");
  const commonT = useTranslations("Common");
  const companiesT = useTranslations("Companies");

  const [data, setData] = React.useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const suppliers = await SuppliersService.getSuppliers(true); // Include inactive to see all
      setData(suppliers);
    } catch (err) {
      console.error(err);
      setError("Failed to load suppliers");
      toast.error("Failed to load suppliers");
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
      await SuppliersService.deleteSupplier(id);
      toast.success(`${name} deleted successfully`);
    } catch (error: any) {
      // Revert on error
      setData(previousData);
      toast.error(error.message || `Failed to delete ${name}`);
    }
  }, [data]);

  // We need to recreate columns to pass the handleDelete if we want to invoke it from the dropdown
  // But columns.tsx currently handles visual definitions. 
  // If we want a delete action in the dropdown that calls this page's handleDelete, we need to modify columns.tsx 
  // or pass a wrapper. For now, the delete in columns.tsx is likely purely visual or needs to be wired up.
  // Ideally, columns.tsx should accept an `onDelete` callback.

  // Let's assume for now we will rely on a generic way or update columns.tsx. 
  // Since columns.tsx is static export, we might need to change it to accept callbacks.
  // However, looking at previous patterns (Banks), we usually pass these via meta or context, 
  // or define columns inside the component if they need to close over state.

  // To keep it simple and consistent with previous steps (Banks), I'll define columns here or pass a callback.
  // But wait, the `getColumns` helper returns the definition array. I can wrap the delete action there.

  // Actually, checking previous `columns.tsx` for Suppliers, it has a Delete item that is just a button.
  // It doesn't call a function. 
  // I should update `columns.tsx` to accept a callback or use a Client Component wrapper.

  // For this step, I will stick to what `getColumns` provides, but I need to make sure the Delete action logic resides somewhere.
  // If `columns.tsx` has the delete logic, it needs access to the service or context.
  // I will refactor `getColumns` to accept `onDelete`.

  const columns = React.useMemo(() => getColumns(t, commonT, companiesT, handleDelete), [t, commonT, companiesT, handleDelete]);

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
          <Link href="/suppliers/new">
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
