"use client";

import { use, useEffect, useState } from "react";
import { BankAccountForm } from "@/components/forms/BankAccountForm";
import { BanksService } from "@/lib/services/banks.service";
import { Banque, BankAccount } from "@/lib/types/models";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";

export default function EditBankAccountPage({
    params,
}: {
    params: Promise<{ id: string; accountId: string }>;
}) {
    const { id, accountId } = use(params);
    const t = useTranslations("Banks");
    const [bank, setBank] = useState<Banque | null>(null);
    const [account, setAccount] = useState<BankAccount | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bankData = await BanksService.getBankById(id);
                setBank(bankData);

                // Find existing account
                if (bankData?.bankAccounts) {
                    const foundAccount = bankData.bankAccounts.find((acc: BankAccount) => acc.id === accountId);
                    setAccount(foundAccount || null);
                }
            } catch (error) {
                console.error("Failed to fetch bank data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, accountId]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!bank || !account) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    {bank.nom} - {t("accountForm.editTitle")}
                </h2>
            </div>
            <div className="mx-auto max-w-2xl">
                <BankAccountForm bankId={id} initialData={account} />
            </div>
        </div>
    );
}
