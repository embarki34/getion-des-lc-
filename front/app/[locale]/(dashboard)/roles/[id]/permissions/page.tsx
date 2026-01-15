"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { RolesService } from "@/lib/services/roles.service";
import { Role, Permission } from "@/lib/types/models";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function RolePermissionsPage() {
    const params = useParams();
    const id = params.id as string;
    const t = useTranslations("Roles"); // Assuming Roles translations exist, or fallback
    const commonT = useTranslations("Common");

    const [role, setRole] = useState<Role | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRole = async () => {
            try {
                setLoading(true);
                const data = await RolesService.getRoleById(id);
                setRole(data);
            } catch (err: any) {
                console.error("Failed to fetch role", err);
                setError(err.message || "Failed to load role");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchRole();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error || !role) {
        return (
            <div className="flex bg-background h-full flex-col items-center justify-center space-y-4 p-8">
                <p className="text-destructive">{error || "Role not found"}</p>
                <Link href="/roles">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                        {commonT("back") || "Back"}
                    </Button>
                </Link>
            </div>
        );
    }

    // Group permissions by resource
    const groupedPermissions = (role.permissions || []).reduce((acc, permission: Permission) => {
        const resource = permission.resource || "Other";
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const resources = Object.keys(groupedPermissions).sort();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center space-x-4">
                <Link href="/roles">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{role.name} Permissions</h2>
                    <p className="text-muted-foreground">
                        {role.description || "View all permissions assigned to this role"}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-2">
                    <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-sm text-muted-foreground px-2">
                        {role.permissions?.length || 0} Permissions Assigned
                    </span>
                    <span className="text-sm text-muted-foreground border-l px-2">
                        Code: <code className="bg-muted px-1 py-0.5 rounded">{role.code}</code>
                    </span>
                </div>

                {resources.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <p className="text-muted-foreground">No permissions assigned to this role.</p>
                            <Link href={`/roles/${id}/edit`}>
                                <Button variant="link" className="mt-2">
                                    Edit Role to Assign Permissions
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {resources.map((resource) => (
                            <Card key={resource} className="h-fit">
                                <CardHeader className="py-3 px-4 bg-muted/50">
                                    <CardTitle className="text-base font-medium capitalize">
                                        {resource.replace(/-/g, ' ')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="py-3 px-4 grid gap-3">
                                    {groupedPermissions[resource].map((permission) => (
                                        <div key={permission.id} className="flex flex-col space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{permission.name}</span>
                                                <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                                    {permission.action}
                                                </Badge>
                                            </div>
                                            {permission.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            )}
                                            {/* <p className="text-[10px] text-muted-foreground font-mono">
                                                {permission.code}
                                            </p> */}
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
