"use client";

import * as React from "react";
import { AuditService, AuditLog } from "@/lib/services/audit.service";
import { columns } from "./columns";
import { DataTable } from "@/components/tables/DataTable";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function AuditLogsPage() {
    const t = useTranslations("System.AuditLogs");
    const commonT = useTranslations("Common");

    const [logs, setLogs] = React.useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                setIsLoading(true);
                const data = await AuditService.getLogs({ limit: 100 });
                setLogs(data.logs);
            } catch (err) {
                console.error("Error fetching audit logs:", err);
                setError("Failed to load audit logs");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLogs();
    }, []);

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
                <p className="text-destructive">{error}</p>
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
            </div>
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <DataTable columns={columns} data={logs} searchKey="entity" />
            </div>
        </div>
    );
}
