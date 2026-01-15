"use client";

import { Role } from "@/lib/types/models";
import { getColumns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { RolesService } from "@/lib/services/roles.service";
import { toast } from "sonner";

export default function RolesPage() {
  const t = useTranslations("Roles");
  const commonT = useTranslations("Common");
  const usersT = useTranslations("Users");

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await RolesService.getRoles(false);
      setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (id: string) => {
    try {
      await RolesService.deleteRole(id);
      toast.success("Role deleted successfully");
      // Refresh the list
      fetchRoles();
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  const columns = getColumns(t, commonT, usersT, handleDeleteRole);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/roles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
              {t("new")}
            </Button>
          </Link>
        </div>
      </div>
      <div className="h-full flex-1 flex-col space-y-8 md:flex">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <p>Loading roles...</p>
          </div>
        ) : (
          <DataTable columns={columns} data={roles} searchKey="name" />
        )}
      </div>
    </div>
  );
}

