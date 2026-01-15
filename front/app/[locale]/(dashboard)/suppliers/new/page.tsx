"use client";

import { SupplierForm } from "@/components/forms/SupplierForm";
import { useTranslations } from "next-intl";

export default function NewSupplierPage() {
    const t = useTranslations("Suppliers");

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{t("createTitle") || "Create Supplier"}</h2>
            </div>
            <SupplierForm />
        </div>
    );
}
