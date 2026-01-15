"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { UsersService } from "@/lib/services/users.service";
import { RolesService } from "@/lib/services/roles.service";
import { Role } from "@/lib/types/models";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Invalid email address." }),
    role: z.string().min(1, { message: "Role is required." }),
    status: z.string(),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

export default function NewUserPage() {
    const t = useTranslations("Users");
    const commonT = useTranslations("Common");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            status: "ACTIVE",
            password: "",
        },
    });

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await RolesService.getRoles(false);
                setRoles(data);
            } catch (error) {
                console.error("Failed to fetch roles", error);
                toast.error("Failed to load roles");
            } finally {
                setRolesLoading(false);
            }
        };

        fetchRoles();
    }, []);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            // We send the role CODE as the legacy role field for now.
            // In the future, we should probably send roleId.
            // But the backend auth/register endpoint likely expects the code (enum string).
            // Let's find the selected role object to get its code.
            const selectedRole = roles.find(r => r.code === values.role || r.id === values.role);
            // If we used ID in the select value, we might want to send code.
            // Or if existing backend expects "ADMIN", "USER", etc.

            // Let's assume for now we use the CODE as the value in the Select if the backend expects the legacy codes.
            // However, the new roles have dynamic codes.
            // If the backend registers with 'role' string, we should pass the code.

            await UsersService.createUser({
                name: values.name,
                email: values.email,
                role: values.role, // This should be the role code
                status: values.status,
                password: values.password
            });

            toast.success(t("created_success") || "User created successfully");
            router.push("/users");
            router.refresh();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to create user");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("new_title") || "Create New User"}</h2>
                    <p className="text-muted-foreground">{t("new_description") || "Add a new user to the system"}</p>
                </div>
            </div>

            <div className="grid gap-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Details</CardTitle>
                                <CardDescription>Enter the details for the new user account.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{commonT("name")}</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="John Doe" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="john@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="••••••••" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t("role") || "Role"}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder={rolesLoading ? "Loading roles..." : "Select role"} />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {roles.map((role) => (
                                                            <SelectItem key={role.id} value={role.code}>
                                                                {role.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{commonT("status")}</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                        <SelectItem value="PENDING">Pending</SelectItem>
                                                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
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
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                                {commonT("save")}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </div>
        </div>
    );
}
