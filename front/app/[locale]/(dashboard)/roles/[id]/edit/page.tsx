"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RolesService } from "@/lib/services/roles.service";
import { PermissionsSelector } from "@/components/roles/PermissionsSelector";
import { Role } from "@/lib/types/models";
import { use } from "react";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    code: z.string(), // Immutable
    description: z.string().optional(),
    isActive: z.boolean(),
    permissions: z.array(z.string()).default([]),
});

interface EditRolePageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default function EditRolePage({ params }: EditRolePageProps) {
    const t = useTranslations("Roles");
    const commonT = useTranslations("Common");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(true);
    const { id } = use(params);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            isActive: true,
            permissions: [],
        },
    });

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const role = await RolesService.getRoleById(id);
                form.reset({
                    name: role.name,
                    code: role.code,
                    description: role.description || "",
                    isActive: role.isActive,
                    permissions: role.permissions?.map(p => p.id) || [],
                });
            } catch (error) {
                console.error("Failed to fetch role", error);
                toast.error("Failed to load role details");
                router.push("/roles");
            } finally {
                setInitializing(false);
            }
        };

        fetchRole();
    }, [id, form, router]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            await RolesService.updateRole(id, {
                name: values.name,
                description: values.description,
                isActive: values.isActive,
                permissions: values.permissions,
            });

            toast.success(t("updated_success") || "Role updated successfully");
            router.push("/roles");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t("updated_error") || "Failed to update role");
        } finally {
            setLoading(false);
        }
    }

    if (initializing) {
        return (
            <div className="flex-1 space-y-4 p-8 pt-6 flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading role details...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t("edit_title") || "Edit Role"}</h2>
                    <p className="text-muted-foreground">{t("edit_description") || "Update role details and permissions"}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{commonT("name")}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Administrator" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled />
                                        </FormControl>
                                        <FormDescription>
                                            Role code cannot be changed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isActive"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                {commonT("active")}
                                            </FormLabel>
                                            <FormDescription>
                                                Enable or disable this role.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{commonT("description")}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description..."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium">{t("permissions") || "Permissions"}</h3>
                                <p className="text-sm text-muted-foreground">
                                    Select functionalities this role can access.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="permissions"
                                render={({ field }) => (
                                    <PermissionsSelector
                                        selectedPermissionIds={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                disabled={loading}
                                variant="outline"
                                onClick={() => router.back()}
                                type="button"
                            >
                                {commonT("cancel")}
                            </Button>
                            <Button disabled={loading} type="submit">
                                {loading && (
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                )}
                                {commonT("save")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
