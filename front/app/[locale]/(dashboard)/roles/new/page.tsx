"use client";

import { useState } from "react";
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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    code: z
        .string()
        .min(2, {
            message: "Code must be at least 2 characters.",
        })
        .regex(/^[A-Z0-9_]+$/, {
            message: "Code must contain only uppercase letters, numbers, and underscores.",
        }),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    permissions: z.array(z.string()).default([]),
});

export default function NewRolePage() {
    const t = useTranslations("Roles");
    const commonT = useTranslations("Common");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            await RolesService.createRole({
                name: values.name,
                code: values.code,
                description: values.description,
                isActive: values.isActive,
                permissions: values.permissions,
            });

            toast.success(t("created_success") || "Role created successfully");
            router.push("/roles");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t("created_error") || "Failed to create role");
        } finally {
            setLoading(false);
        }
    }

    // Auto-generate code from name if code is empty
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        form.setValue("name", name);

        // Only update code if it hasn't been manually edited or is empty/matches previous generation
        const currentCode = form.getValues("code");
        const generatedCode = name
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "_")
            .replace(/_+/g, "_")
            .replace(/^_|_$/g, "");

        if (!currentCode || currentCode === form.formState.defaultValues?.code) {
            form.setValue("code", generatedCode);
        }
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">{t("new_title")}</h2>
                    <p className="text-muted-foreground">{t("new_description")}</p>
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
                                            <Input
                                                placeholder="Administrator"
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    handleNameChange(e);
                                                }}
                                            />
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
                                            <Input placeholder="ADMIN" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Unique identifier for the role. Uppercase, numbers, and underscores only.
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
                                            placeholder="Full system access..."
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
