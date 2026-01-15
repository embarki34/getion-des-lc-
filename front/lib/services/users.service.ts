import { bffClient } from "@/lib/api/client";
import { User } from "@/lib/types/models";
import { ApiResponse } from "@/lib/types/api";

/**
 * Users Service
 * Handles all user related API calls
 */
export class UsersService {
    /**
     * Fetch users
     * Supports filtering by businessUnitId
     */
    static async getUsers(params?: { businessUnitId?: string }): Promise<User[]> {
        try {
            let url = "/api/dashboard/users";

            if (params?.businessUnitId) {
                // Use the specific endpoint for BU filtering
                url = `/api/dashboard/users/business-unit/${params.businessUnitId}`;
            }

            const data = await bffClient.get<any>(url);

            let users: any[] = [];

            // Backend format check
            if (data.data && Array.isArray(data.data)) {
                users = data.data;
            } else if (Array.isArray(data)) {
                users = data;
            }

            // Map backend user to frontend User model
            return users.map((u: any) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                status: u.status ? u.status.toUpperCase() : (u.isActive ? "ACTIVE" : "INACTIVE"),
                lastLogin: u.lastLoginAt ? new Date(u.lastLoginAt) : undefined,
                avatarUrl: u.avatarUrl,
                createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
                updatedAt: u.updatedAt ? new Date(u.updatedAt) : new Date(),
            })) as User[];
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }

    /**
     * Get a single user by ID
     */
    static async getUserById(id: string): Promise<any> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/users/${id}`);

            // Handle both wrapped and unwrapped responses
            const userData = data.data?.user || data.user || data;

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: userData.status ? userData.status.toUpperCase() : "ACTIVE",
                emailVerified: userData.emailVerified,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLoginAt ? new Date(userData.lastLoginAt) : undefined,
            };
        } catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
    }

    /**
     * Create a new user
     */
    static async createUser(data: { name: string; email: string; role: string; status: string; password?: string }): Promise<{ id: string }> {
        try {
            // Note: Register usually returns different structure. Assuming BFF handles it or returns what Backend sends.
            // Using /api/auth/register directly? Auth routes might be public and not need bffClient with Refresh logic?
            // Actually /api/auth/register is usually public. 
            // BUT here we are creating a user as Admin? 
            // If creating user as Admin, we should use /users endpoint, not /auth/register?
            // Existing code used /api/auth/register. I will keep it.
            // bffClient handles cookies so it will send Auth Token if present, but Register usually ignores it.
            // Wait, if it's Admin creating user, it SHOULD be authenticated? 
            // The endpoint `/auth/register` is Public registration.
            // Does the system allow Admin to create users via this endpoint? 
            // If so, keeping it is fine.

            const result = await bffClient.post<any>("/api/auth/register", {
                ...data,
                phone: "0000000000",
            });

            return { id: result.data?.user?.id };
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    }

    /**
     * Update a user
     */
    static async updateUser(id: string, data: { name?: string; role?: string; status?: string }): Promise<void> {
        try {
            await bffClient.put(`/api/dashboard/users/${id}`, data);
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }

    /**
     * Change current user's password
     */
    static async changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
        try {
            await bffClient.put("/api/dashboard/users/me/password", data);
        } catch (error) {
            console.error("Error changing password:", error);
            throw error;
        }
    }

    /**
     * Reset another user's password (admin only)
     */
    static async resetUserPassword(userId: string, newPassword: string, sendEmail: boolean = true): Promise<void> {
        try {
            await bffClient.post(`/api/dashboard/users/${userId}/reset-password`, { newPassword, sendEmail });
        } catch (error) {
            console.error("Error resetting user password:", error);
            throw error;
        }
    }
    /**
     * Get current user profile
     */
    static async getMe(): Promise<any> {
        try {
            const data = await bffClient.get<any>("/api/dashboard/users/me");
            return data.data?.user || data.user || data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    }
    /**
     * Delete a user
     */
    static async deleteUser(id: string): Promise<void> {
        try {
            await bffClient.delete(`/api/dashboard/users/${id}`);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
    }
}

