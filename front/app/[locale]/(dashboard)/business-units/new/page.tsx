"use client";

import { BusinessUnitForm } from "@/components/forms/BusinessUnitForm";
import { useTranslations } from "next-intl";

export default function NewBusinessUnitPage() {
    const t = useTranslations("BusinessUnits");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("createTitle") || "Create Business Unit"}</h2>
            </div>
            <BusinessUnitForm />
        </div>
    );
}
