"use client";

import { CreditLineForm } from "@/components/forms/CreditLineForm";
import { CreditLinesService } from "@/lib/services/credit-lines.service";
import { CreditLine } from "@/lib/types/models";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { use } from "react";

interface EditCreditLinePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function EditCreditLinePage({ params }: EditCreditLinePageProps) {
    const { id } = use(params);
    const [creditLine, setCreditLine] = useState<CreditLine | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCreditLine = async () => {
            try {
                const data = await CreditLinesService.getCreditLineById(id);
                // @ts-ignore
                const creditLineData = data.data || data;
                setCreditLine(creditLineData);
            } catch (error) {
                console.error("Failed to fetch credit line", error);
                toast.error("Failed to fetch credit line details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCreditLine();
        }
    }, [id]);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!creditLine) {
        return <div className="p-8">Credit Line not found</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">
                    Edit Credit Line
                </h2>
            </div>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <CreditLineForm initialData={creditLine} isEditing={true} />
            </div>
        </div>
    );
}
