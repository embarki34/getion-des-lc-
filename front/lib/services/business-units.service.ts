import { ApiResponse } from "@/lib/types/api";
import { BusinessUnit } from "@/lib/types/models";

/**
 * Business Units Service
 * Handles all business unit related API calls
 */
export class BusinessUnitsService {
    /**
     * Fetch all business units
     */
    static async getBusinessUnits(companyId?: string): Promise<BusinessUnit[]> {
        try {
            const url = companyId
                ? `/api/dashboard/business-units?companyId=${companyId}`
                : "/api/dashboard/business-units";

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch business units");
            }

            // Check if data has a 'data' property (backend format) or is the array itself
            // Adjust based on your actual backend response structure
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching business units:", error);
            throw error;
        }
    }

    /**
     * Get a single business unit by ID
     */
    static async getBusinessUnitById(id: string): Promise<any> {
        try {
            const response = await fetch(`/api/dashboard/business-units/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch business unit");
            }

            if (data.data) {
                return data.data;
            }

            return data;
        } catch (error) {
            console.error("Error fetching business unit:", error);
            throw error;
        }
    }

    /**
     * Create a new business unit
     */
    static async createBusinessUnit(buData: Partial<BusinessUnit>): Promise<any> {
        try {
            const response = await fetch("/api/dashboard/business-units", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(buData),
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create business unit");
            }

            return data.data;
        } catch (error) {
            console.error("Error creating business unit:", error);
            throw error;
        }
    }

    /**
     * Update an existing business unit
     */
    static async updateBusinessUnit(id: string, buData: Partial<BusinessUnit>): Promise<any> {
        try {
            const response = await fetch(`/api/dashboard/business-units/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(buData),
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update business unit");
            }

            return data.data;
        } catch (error) {
            console.error("Error updating business unit:", error);
            throw error;
        }
    }

    /**
     * Delete a business unit
     */
    static async deleteBusinessUnit(id: string): Promise<void> {
        try {
            const response = await fetch(`/api/dashboard/business-units/${id}`, {
                method: "DELETE",
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete business unit");
            }
        } catch (error) {
            console.error("Error deleting business unit:", error);
            throw error;
        }
    }
}
