"use client";

import { useTranslations } from "next-intl";
import { BusinessUnitForm } from "@/components/forms/BusinessUnitForm";
import { BusinessUnitsService } from "@/lib/services/business-units.service";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BusinessUnit } from "@/lib/types/models";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function EditBusinessUnitPage({ params }: { params: Promise<{ id: string }> }) {
    const t = useTranslations("BusinessUnits");
    const commonT = useTranslations("Common");
    const [data, setData] = React.useState<BusinessUnit | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const router = useRouter();

    const { id } = React.use(params);

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const bu = await BusinessUnitsService.getBusinessUnitById(id);
            setData(bu);
        } catch (error) {
            console.error(error);
            toast.error(commonT("loadError") || "Failed to load business unit");
        } finally {
            setIsLoading(false);
        }
    }, [id, commonT]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-muted-foreground">{commonT("notFound") || "Business Unit not found"}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    {commonT("back")}
                </Button>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("editTitle") || "Edit Business Unit"}</h2>
            </div>
            <BusinessUnitForm initialData={data} />
        </div>
    );
}
