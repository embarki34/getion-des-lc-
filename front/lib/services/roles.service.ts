import { Role, Permission } from "@/lib/types/models";

/**
 * Create Role DTO
 */
export interface CreateRoleDTO {
    name: string;
    code: string;
    description?: string;
    isActive?: boolean;
    permissions?: string[];
}

/**
 * Update Role DTO
 */
export interface UpdateRoleDTO {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissions?: string[];
}

/**
 * Roles Service
 * Handles all role-related API calls
 */
export class RolesService {
    /**
     * Fetch all roles
     * @param includeInactive - Whether to include inactive roles
     */
    static async getRoles(includeInactive: boolean = false): Promise<Role[]> {
        try {
            const url = `/api/dashboard/roles${includeInactive ? "?includeInactive=true" : ""}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch roles");
            }

            // Handle both wrapped and unwrapped responses
            let roles: any[] = [];
            if (data.data && Array.isArray(data.data)) {
                roles = data.data;
            } else if (Array.isArray(data)) {
                roles = data;
            }

            // Map backend role to frontend Role model
            return roles.map((r: any) => ({
                id: r.id,
                name: r.name,
                code: r.code,
                description: r.description,
                isActive: r.isActive,
                permissionsCount: r.permissionsCount || 0,
                usersCount: r.usersCount || 0,
                createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
                updatedAt: r.updatedAt ? new Date(r.updatedAt) : undefined,
            }));
        } catch (error) {
            console.error("Error fetching roles:", error);
            throw error;
        }
    }

    /**
     * Get a single role by ID
     */
    static async getRoleById(id: string): Promise<Role> {
        try {
            const response = await fetch(`/api/dashboard/roles/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch role");
            }

            // Handle both wrapped and unwrapped responses
            const roleData = data.data || data;

            return {
                id: roleData.id,
                name: roleData.name,
                code: roleData.code,
                description: roleData.description,
                isActive: roleData.isActive,
                permissionsCount: roleData.permissionsCount || 0,
                usersCount: roleData.usersCount || 0,
                permissions: roleData.permissions,
                createdAt: roleData.createdAt ? new Date(roleData.createdAt) : undefined,
                updatedAt: roleData.updatedAt ? new Date(roleData.updatedAt) : undefined,
            };
        } catch (error) {
            console.error("Error fetching role:", error);
            throw error;
        }
    }

    /**
     * Create a new role
     */
    static async createRole(data: CreateRoleDTO): Promise<{ id: string }> {
        try {
            const response = await fetch("/api/dashboard/roles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to create role");
            }

            return { id: result.id || result.data?.id };
        } catch (error) {
            console.error("Error creating role:", error);
            throw error;
        }
    }

    /**
     * Update a role
     */
    static async updateRole(id: string, data: UpdateRoleDTO): Promise<void> {
        try {
            const response = await fetch(`/api/dashboard/roles/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to update role");
            }
        } catch (error) {
            console.error("Error updating role:", error);
            throw error;
        }
    }

    /**
     * Delete a role
     */
    static async deleteRole(id: string): Promise<void> {
        try {
            const response = await fetch(`/api/dashboard/roles/${id}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to delete role");
            }
        } catch (error) {
            console.error("Error deleting role:", error);
            throw error;
        }
    }
    /**
     * Fetch all permissions
     */
    static async getPermissions(): Promise<Permission[]> {
        try {
            const response = await fetch("/api/dashboard/permissions");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch permissions");
            }

            return data.data || data;
        } catch (error) {
            console.error("Error fetching permissions:", error);
            throw error;
        }
    }
}
