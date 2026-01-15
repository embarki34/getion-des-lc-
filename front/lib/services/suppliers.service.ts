import { bffClient } from "@/lib/api/client";
import { Supplier } from "@/lib/types/models";
import { ApiResponse } from "@/lib/types/api";

/**
 * Suppliers Service
 * Handles all supplier related API calls
 */
export class SuppliersService {
    /**
     * Fetch all suppliers
     */
    static async getSuppliers(params?: { includeInactive?: boolean; businessUnitId?: string }): Promise<Supplier[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params?.includeInactive) queryParams.append("includeInactive", "true");
            if (params?.businessUnitId) queryParams.append("businessUnitId", params.businessUnitId);

            const url = `/api/dashboard/suppliers?${queryParams.toString()}`;

            const data = await bffClient.get<any>(url);

            // Backend format check
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching suppliers:", error);
            throw error;
        }
    }

    /**
     * Get a single supplier by ID
     */
    static async getSupplierById(id: string): Promise<any> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/suppliers/${id}`);

            if (data.data) {
                return data.data;
            }

            return data;
        } catch (error) {
            console.error("Error fetching supplier:", error);
            throw error;
        }
    }

    /**
     * Create a new supplier
     */
    static async createSupplier(supplierData: Partial<Supplier>): Promise<any> {
        try {
            const data = await bffClient.post<ApiResponse<any>>("/api/dashboard/suppliers", supplierData);
            return data.data;
        } catch (error) {
            console.error("Error creating supplier:", error);
            throw error;
        }
    }

    /**
     * Update an existing supplier
     */
    static async updateSupplier(id: string, supplierData: Partial<Supplier>): Promise<any> {
        try {
            const data = await bffClient.put<ApiResponse<any>>(`/api/dashboard/suppliers/${id}`, supplierData);
            return data.data;
        } catch (error) {
            console.error("Error updating supplier:", error);
            throw error;
        }
    }

    /**
     * Delete a supplier
     */
    static async deleteSupplier(id: string): Promise<void> {
        try {
            await bffClient.delete(`/api/dashboard/suppliers/${id}`);
        } catch (error) {
            console.error("Error deleting supplier:", error);
            throw error;
        }
    }
}
