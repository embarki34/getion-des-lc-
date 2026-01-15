import { CreditLine } from "@/lib/types/models";
import { ApiResponse } from "../types/api";

export class CreditLinesService {
  /**
   * Fetch all credit lines
   */
  static async getCreditLines(): Promise<CreditLine[]> {
    try {
      // Use Next.js Proxy Route to handle authentication (httpOnly cookies)
      const response = await fetch("/api/dashboard/credit-lines");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch credit lines");
      }

      const data = await response.json();

      // Handle different response structures
      if (data && Array.isArray(data)) {
        return data;
      } else if (data.data && Array.isArray(data.data)) {
        return data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching credit lines:", error);
      throw error;
    }
  }

  /**
   * Get a single credit line by ID
   */
  static async getCreditLineById(id: string): Promise<ApiResponse<CreditLine>> {
    try {
      const response = await fetch(`/api/dashboard/credit-lines/${id}`);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch credit line");
      }

      return data;
    } catch (error) {
      console.error("Error fetching credit line:", error);
      throw error;
    }
  }

  /**
   * Create a new credit line
   */
  static async createCreditLine(data: Partial<CreditLine>): Promise<any> {
    try {
      const response = await fetch("/api/dashboard/credit-lines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to create credit line");
      }

      return responseData.data;
    } catch (error) {
      console.error("Error creating credit line:", error);
      throw error;
    }
  }

  /**
   * Update a credit line
   */
  static async updateCreditLine(id: string, data: Partial<CreditLine>): Promise<any> {
    try {
      const response = await fetch(`/api/dashboard/credit-lines/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update credit line");
      }

      return responseData.data;
    } catch (error) {
      console.error("Error updating credit line:", error);
      throw error;
    }
  }

  /**
   * Delete a credit line
   */
  static async deleteCreditLine(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/dashboard/credit-lines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete credit line");
      }
    } catch (error) {
      console.error("Error deleting credit line:", error);
      throw error;
    }
  }
}
