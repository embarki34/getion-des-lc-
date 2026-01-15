"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { toast } from "sonner";
import { BanksService } from "@/lib/services/banks.service";
import { useTranslations } from "next-intl";

import { BankAccount } from "@/lib/types/models";

interface BankAccountFormProps {
    bankId: string;
    initialData?: BankAccount;
}

export function BankAccountForm({ bankId, initialData }: BankAccountFormProps) {
    const router = useRouter();
    const t = useTranslations("Banks.accountForm");
    const commonT = useTranslations("Common");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const formSchema = z.object({
        accountNumber: z.string().regex(/^\d{8,34}$/, {
            message: t("accountNumberDesc") || "Must be numeric and between 8 and 34 characters",
        }),
        keyAccount: z.string().min(2).max(2, {
            message: t("keyDesc"),
        }),
        currency: z.string().min(3, {
            message: commonT("required"),
        }),
        rib: z.string().optional(),
    });

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountNumber: initialData?.accountNumber || "",
            keyAccount: initialData?.keyAccount || "",
            currency: initialData?.currency || "DZD",
            rib: initialData?.rib || "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            if (initialData) {
                await BanksService.updateBankAccount(bankId, initialData.id, {
                    ...values,
                    isActive: initialData.isActive,
                });
                toast.success(t("updated"));
            } else {
                await BanksService.createBankAccount(bankId, {
                    ...values,
                    isActive: true,
                });
                toast.success(t("success"));
            }

            router.push(`/banks/${bankId}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || commonT("error"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{initialData ? t("editTitle") : t("title")}</h3>
                <p className="text-sm text-muted-foreground">{initialData ? t("editDescription") : t("description")}</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="accountNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("accountNumber")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234567890" {...field} />
                                    </FormControl>
                                    <FormDescription>{t("accountNumberDesc")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="keyAccount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("key")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="00" maxLength={2} {...field} />
                                    </FormControl>
                                    <FormDescription>{t("keyDesc")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t("currency")}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder={t("currencyDesc")} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="DZD">DZD (Algerian Dinar)</SelectItem>
                                            <SelectItem value="EUR">EUR (Euro)</SelectItem>
                                            <SelectItem value="USD">USD (US Dollar)</SelectItem>
                                            <SelectItem value="GBP">GBP (British Pound)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>{t("currencyDesc")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rib"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>{t("rib")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="001..." {...field} />
                                    </FormControl>
                                    <FormDescription>{t("ribDesc")}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button disabled={isLoading} type="submit">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                            )}
                            {commonT("save")}
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => router.back()}
                            disabled={isLoading}
                        >
                            {commonT("cancel")}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
