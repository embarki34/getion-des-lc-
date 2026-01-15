"use client";

import { useEffect, useState } from "react";
import { Permission } from "@/lib/types/models";
import { RolesService } from "@/lib/services/roles.service";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

interface PermissionsSelectorProps {
    selectedPermissionIds: string[];
    onChange: (ids: string[]) => void;
    readOnly?: boolean;
}

export function PermissionsSelector({
    selectedPermissionIds,
    onChange,
    readOnly = false,
}: PermissionsSelectorProps) {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await RolesService.getPermissions();
                setPermissions(data);
            } catch (error) {
                console.error("Failed to fetch permissions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const groupedPermissions = permissions.reduce((acc, permission) => {
        const resource = permission.resource;
        if (!acc[resource]) {
            acc[resource] = [];
        }
        acc[resource].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const filteredResources = Object.keys(groupedPermissions).filter((resource) => {
        if (!searchQuery) return true;
        const resourceMatch = resource.toLowerCase().includes(searchQuery.toLowerCase());
        const permissionMatch = groupedPermissions[resource].some((p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return resourceMatch || permissionMatch;
    });

    const handleTogglePermission = (id: string, checked: boolean) => {
        if (readOnly) return;
        if (checked) {
            onChange([...selectedPermissionIds, id]);
        } else {
            onChange(selectedPermissionIds.filter((pId) => pId !== id));
        }
    };

    const handleToggleResource = (resource: string, checked: boolean) => {
        if (readOnly) return;
        const resourcePermissionIds = groupedPermissions[resource].map((p) => p.id);
        if (checked) {
            const newIds = Array.from(new Set([...selectedPermissionIds, ...resourcePermissionIds]));
            onChange(newIds);
        } else {
            onChange(selectedPermissionIds.filter((id) => !resourcePermissionIds.includes(id)));
        }
    };

    if (loading) {
        return <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-40 w-full" />
                ))}
            </div>
        </div>;
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search permissions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredResources.map((resource) => {
                    const resourcePermissions = groupedPermissions[resource];
                    const allSelected = resourcePermissions.every((p) => selectedPermissionIds.includes(p.id));
                    const someSelected = resourcePermissions.some((p) => selectedPermissionIds.includes(p.id));

                    if (searchQuery && !resource.toLowerCase().includes(searchQuery.toLowerCase()) &&
                        !resourcePermissions.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))) {
                        return null; // Should be handled by filteredResources but double checking
                    }

                    // If filtered by text, only show matching permissions or all if resource matches?
                    // Let's filter permissions inside the card if search is active
                    const displayPermissions = searchQuery
                        ? resourcePermissions.filter(p =>
                            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            resource.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        : resourcePermissions;

                    if (displayPermissions.length === 0) return null;

                    return (
                        <Card key={resource} className="h-fit">
                            <CardHeader className="py-3 px-4 bg-muted/50 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base font-medium capitalize">
                                    {resource.replace(/-/g, ' ')}
                                </CardTitle>
                                {!readOnly && (
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(checked) => handleToggleResource(resource, checked === true)}
                                        aria-label={`Select all ${resource} permissions`}
                                    />
                                )}
                            </CardHeader>
                            <CardContent className="py-3 px-4 grid gap-2">
                                {displayPermissions.map((permission) => (
                                    <div key={permission.id} className="flex items-start space-x-2">
                                        <Checkbox
                                            id={permission.id}
                                            checked={selectedPermissionIds.includes(permission.id)}
                                            onCheckedChange={(checked) => handleTogglePermission(permission.id, checked === true)}
                                            disabled={readOnly}
                                        />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label
                                                htmlFor={permission.id}
                                                className="text-sm font-normal cursor-pointer leading-snug"
                                            >
                                                {permission.name}
                                            </Label>
                                            {permission.description && (
                                                <p className="text-xs text-muted-foreground">
                                                    {permission.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
            {filteredResources.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    No permissions found matching your search.
                </div>
            )}
        </div>
    );
}
