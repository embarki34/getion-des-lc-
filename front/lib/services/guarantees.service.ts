import { ApiResponse } from "@/lib/types/api";

export class GuaranteesService {
    static async getGuarantees(): Promise<any[]> {
        try {
            const response = await fetch("/api/dashboard/guarantees");
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch guarantees");
            }

            // Backend returns { success: true, data: [...] }
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data; // purely array
            }

            return [];
        } catch (error) {
            console.error("Error fetching guarantees:", error);
            throw error;
        }
    }
}
