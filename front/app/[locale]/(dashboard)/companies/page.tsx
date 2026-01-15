"use client";

import { Company } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState, useOptimistic, startTransition } from "react";
import { CompaniesService } from "@/lib/services/companies.service";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CompaniesPage = () => {
  const t = useTranslations("Companies");
  const commonT = useTranslations("Common");
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [optimisticCompanies, removeOptimisticCompany] = useOptimistic(
    companies,
    (state, idToRemove: string) => {
      return state.filter((item) => item.id !== idToRemove);
    }
  );

  const handleDelete = async (company: Company) => {
    if (!confirm(commonT("deleteConfirm") || "Are you sure?")) {
      return;
    }

    startTransition(async () => {
      removeOptimisticCompany(company.id);
      try {
        await CompaniesService.deleteCompany(company.id);
        toast.success(commonT("deleteSuccess") || "Company deleted");
        setCompanies((prev) => prev.filter((item) => item.id !== company.id));
      } catch (error: any) {
        toast.error(error.message || commonT("deleteFailed"));
      }
    });
  };

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await CompaniesService.getCompanies();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || commonT("error"));
      console.error("Error loading companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const columns = getColumns(t, commonT, router, handleDelete);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/companies/new">
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
            <span className="ml-2 text-muted-foreground">{commonT("loading") || "Loading..."}</span>
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
                onClick={fetchCompanies}
              >
                {commonT("retry") || "Retry"}
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <DataTable columns={columns} data={optimisticCompanies} searchKey="name" />
        )}
      </div>
    </div>
  );
}

export default CompaniesPage;
