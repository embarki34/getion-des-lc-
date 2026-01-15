"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UsersService } from "@/lib/services/users.service";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { RolesService } from "@/lib/services/roles.service";
import { Role } from "@/lib/types/models";

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const commonT = useTranslations("Common");
    const usersT = useTranslations("Users");

    const [user, setUser] = React.useState<any | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSaving, setIsSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Form state
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        role: "",
        status: "",
    });

    const [roles, setRoles] = React.useState<Role[]>([]);
    const [rolesLoading, setRolesLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const userData = await UsersService.getUserById(id);
                setUser(userData);
                setFormData({
                    name: userData.name || "",
                    email: userData.email || "",
                    role: userData.role || "",
                    status: (userData.status === "INACTIVE" ? "suspended" : userData.status?.toLowerCase()) || "active",
                });
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError(err instanceof Error ? err.message : "Failed to load user details");
            } finally {
                setIsLoading(false);
            }
        };

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

        if (id) {
            fetchData();
            fetchRoles();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            await UsersService.updateUser(id, formData);

            toast.success("User updated successfully");
            router.push(`/users/${id}`);
        } catch (err) {
            console.error("Error updating user:", err);
            toast.error(err instanceof Error ? err.message : "Failed to update user");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "User not found"}</p>
                <Link href="/users">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {commonT("back")}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href={`/users/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{usersT("edit")}</h2>
                    <p className="text-muted-foreground">{user.name}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                        <CardDescription>
                            Update the user's basic information and permissions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">{commonT("name")}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">{usersT("role")}</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => handleSelectChange("role", value)}
                                >
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                        <SelectItem value="MANAGER">Manager</SelectItem>
                                        <SelectItem value="USER">User</SelectItem>
                                        <SelectItem value="VIEWER">Viewer</SelectItem>
                                        {roles.map((role) => (
                                            /* Prevent duplicates if fetch roles includes hardcoded ones or if backend return mixed.
                                               Actually, let's just use dynamic roles. But if user has a role that is NOT in dynamic list (legacy), we should display it or map it.
                                               Ideally we show ONLY dynamic roles. But for existing users with legacy string roles, we might have issues if those codes don't match.
                                               Let's assume backend seed created roles matching these codes (ADMIN, USER etc).
                                               The seed created: SUPER_ADMIN, SYSTEM_ADMIN, FINANCE_MANAGER, etc.
                                               Legacy roles might be "ADMIN", "USER".
                                               If legacy role is "ADMIN" and new role code "ADMIN" exists, it's fine.
                                               If new roles are "SUPER_ADMIN", "SYSTEM_ADMIN"..., then "ADMIN" might be missing.
                                               Let's keep legacy options for fallback OR just use dynamic.
                                               The user request is "change the user creat to use the roles".
                                               So I should use the DYNAMIC roles.
                                            */
                                            <SelectItem key={role.id} value={role.code}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">{commonT("status")}</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleSelectChange("status", value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4">
                            <Link href={`/users/${id}`}>
                                <Button type="button" variant="outline">
                                    {commonT("cancel")}
                                </Button>
                            </Link>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
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
        </div>
    );
}
