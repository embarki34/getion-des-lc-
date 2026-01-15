import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/config/api";
import { Banque } from "@/lib/types/models";
import { ApiResponse, BanksListResponse } from "@/lib/types/api";

/**
 * Banks Service
 * Handles all bank-related API calls
 */
export class BanksService {
  /**
   * Fetch all banks
   */
  static async getBanks(): Promise<any[]> {
    try {
      const response = await fetch("/api/dashboard/bank");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch banks");
      }

      console.log("API Response:", data); // Debug log

      // The API route returns the axios response directly
      // Check if data has a 'data' property (backend format) or is the array itself
      if (data.data && Array.isArray(data.data)) {
        return data.data;
      } else if (Array.isArray(data)) {
        return data;
      }

      return [];
    } catch (error) {
      console.error("Error fetching banks:", error);
      throw error;
    }
  }

  /**
   * Get a single bank by ID
   */
  static async getBankById(id: string): Promise<any> {
    try {
      const response = await fetch(`/api/dashboard/bank/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch bank");
      }

      // Check if data has a 'data' property (backend format)
      if (data.data) {
        return data.data;
      }

      return data;
    } catch (error) {
      console.error("Error fetching bank:", error);
      throw error;
    }
  }

  /**
   * Create a new bank
   */
  static async createBank(bankData: Partial<Banque>): Promise<any> {
    try {
      const response = await fetch("/api/dashboard/bank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bankData),
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create bank");
      }

      return data.data;
    } catch (error) {
      console.error("Error creating bank:", error);
      throw error;
    }
  }

  /**
   * Update an existing bank
   */
  static async updateBank(id: string, bankData: Partial<Banque>): Promise<any> {
    try {
      const response = await fetch("/api/dashboard/bank", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...bankData }),
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update bank");
      }

      return data.data;
    } catch (error) {
      console.error("Error updating bank:", error);
      throw error;
    }
  }

  /**
   * Delete a bank
   */
  static async deleteBank(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/dashboard/bank?id=${id}`, {
        method: "DELETE",
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete bank");
      }
    } catch (error) {
      console.error("Error deleting bank:", error);
      throw error;
    }
  }

  /**
   * Add a bank account to a bank
   */
  static async createBankAccount(bankId: string, accountData: any): Promise<any> {
    try {
      // Assuming the endpoint logic: POST /api/dashboard/bank/:id/accounts
      // However, looking at existing patterns, it might be handled via a unified update or a specific sub-resource
      // For now, let's target a specific sub-resource endpoint pattern
      console.log('this is the creat banck account ')
      const response = await fetch(`/api/dashboard/bank/${bankId}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData),
      });

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create bank account");
      }

      return data.data;
    } catch (error) {
      console.error("Error creating bank account:", error);
      throw error;
    }
  }

  /**
   * Update a bank account
   */
  static async updateBankAccount(
    bankId: string,
    accountId: string,
    accountData: any
  ): Promise<any> {
    try {
      const response = await fetch(
        `/api/dashboard/bank/${bankId}/accounts/${accountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountData),
        }
      );

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update bank account");
      }

      return data.data;
    } catch (error) {
      console.error("Error updating bank account:", error);
      throw error;
    }
  }

  /**
   * Delete a bank account
   */
  static async deleteBankAccount(bankId: string, accountId: string): Promise<void> {
    try {
      const response = await fetch(
        `/api/dashboard/bank/${bankId}/accounts/${accountId}`,
        {
          method: "DELETE",
        }
      );

      const data: ApiResponse<any> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete bank account");
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      throw error;
    }
  }
}
