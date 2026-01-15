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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { BusinessUnit, Company } from "@/lib/types/models";
import { useTranslations } from "next-intl";
import { BusinessUnitsService } from "@/lib/services/business-units.service";
import { CompaniesService } from "@/lib/services/companies.service";

interface BusinessUnitFormProps {
    initialData?: BusinessUnit | null;
}

export function BusinessUnitForm({ initialData }: BusinessUnitFormProps) {
    const router = useRouter();
    const t = useTranslations("BusinessUnits"); // Assuming you'll add these keys
    const commonT = useTranslations("Common");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [companies, setCompanies] = React.useState<Company[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = React.useState<boolean>(false);

    const formSchema = z.object({
        code: z.string().min(2, {
            message: commonT("required"),
        }),
        name: z.string().min(2, {
            message: commonT("required"),
        }),
        description: z.string().optional(),
        companyId: z.string().min(1, {
            message: commonT("required"),
        }),
        isActive: z.boolean().default(true),
    });

    const title = initialData ? commonT("edit") : commonT("create");
    const descText = initialData
        ? t("editDesc") || "Edit business unit"
        : t("createDesc") || "Add business unit";
    const action = initialData ? commonT("save") : commonT("create");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
            ? {
                code: initialData.code,
                name: initialData.name,
                description: (initialData as any).description || "",
                companyId: initialData.companyId,
                isActive: initialData.isActive,
            }
            : {
                code: "",
                name: "",
                description: "",
                companyId: "",
                isActive: true,
            },
    });

    React.useEffect(() => {
        const fetchCompanies = async () => {
            setIsLoadingCompanies(true);
            try {
                const data = await CompaniesService.getCompanies();
                setCompanies(data);
            } catch (error) {
                toast.error("Failed to load companies");
            } finally {
                setIsLoadingCompanies(false);
            }
        };
        fetchCompanies();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);

        try {
            if (initialData) {
                await BusinessUnitsService.updateBusinessUnit(initialData.id, values);
                toast.success(commonT("updateSuccess") || "Business unit updated successfully");
            } else {
                await BusinessUnitsService.createBusinessUnit(values);
                toast.success(commonT("createSuccess") || "Business unit created successfully");
            }
            router.push("/business-units");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{descText}</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2">

                        {/* Code */}
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{commonT("code")}</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="BU-001"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{commonT("name")}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Engineering" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Company Selection */}
                        <FormField
                            control={form.control}
                            name="companyId"
                            render={({ field }) => (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>{t("company") || "Company"}</FormLabel>
                                    <Select
                                        disabled={isLoadingCompanies}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        isLoadingCompanies
                                                            ? "Loading..."
                                                            : t("selectCompany") || "Select a company"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id}>
                                                    {company.name} ({company.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>{commonT("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Active Status */}
                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 col-span-2 rtl:space-x-reverse">
                                    <FormControl>
                                        <Checkbox
                                            checked={!!field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>{commonT("status")}</FormLabel>
                                        <FormDescription>
                                            {t("activeDesc") || "Is this business unit active?"}
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={isLoading} type="submit">
                            {isLoading && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:ml-2 rtl:mr-0" />
                            )}
                            {action}
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
