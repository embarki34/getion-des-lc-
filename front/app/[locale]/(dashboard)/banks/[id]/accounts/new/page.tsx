"use client";

import { use, useEffect, useState } from "react";
import { BankAccountForm } from "@/components/forms/BankAccountForm";
import { BanksService } from "@/lib/services/banks.service";
import { Banque } from "@/lib/types/models";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CreateBankAccountPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const t = useTranslations("Banks");
    const [bank, setBank] = useState<Banque | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch bank details just to ensure it exists and show name if needed
        const fetchBank = async () => {
            try {
                const data = await BanksService.getBankById(id);
                setBank(data);
            } catch (error) {
                console.error("Failed to fetch bank", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBank();
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!bank) {
        return <div>Bank not found</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    {bank.nom} - {t("accountForm.title")}
                </h2>
            </div>
            <div className="mx-auto max-w-2xl">
                <BankAccountForm bankId={id} />
            </div>
        </div>
    );
}
