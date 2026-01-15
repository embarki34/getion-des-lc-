import { ApiResponse } from "@/lib/types/api";
import { Company } from "@/lib/types/models";

/**
 * Companies Service
 * Handles all company-related API calls
 */
export class CompaniesService {
    /**
     * Fetch all companies
     */
    static async getCompanies(): Promise<Company[]> {
        try {
            const response = await fetch("/api/dashboard/companies");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch companies");
            }

            // Check if data has a 'data' property (backend format) or is the array itself
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching companies:", error);
            throw error;
        }
    }

    /**
     * Get a single company by ID
     */
    static async getCompanyById(id: string): Promise<any> {
        try {
            const response = await fetch(`/api/dashboard/companies/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch company");
            }

            if (data.data) {
                return data.data;
            }

            return data;
        } catch (error) {
            console.error("Error fetching company:", error);
            throw error;
        }
    }

    /**
     * Create a new company
     */
    static async createCompany(companyData: Partial<Company>): Promise<any> {
        try {
            const response = await fetch("/api/dashboard/companies", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create company");
            }

            return data.data;
        } catch (error) {
            console.error("Error creating company:", error);
            throw error;
        }
    }

    /**
     * Update an existing company
     */
    static async updateCompany(id: string, companyData: Partial<Company>): Promise<any> {
        try {
            const response = await fetch(`/api/dashboard/companies/${id}`, {
                method: "PUT", // Or PATCH depending on backend
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update company");
            }

            return data.data;
        } catch (error) {
            console.error("Error updating company:", error);
            throw error;
        }
    }

    /**
     * Delete a company
     */
    static async deleteCompany(id: string): Promise<void> {
        try {
            const response = await fetch(`/api/dashboard/companies/${id}`, {
                method: "DELETE",
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete company");
            }
        } catch (error) {
            console.error("Error deleting company:", error);
            throw error;
        }
    }
}
