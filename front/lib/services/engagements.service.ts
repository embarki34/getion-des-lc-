import { ApiResponse } from "@/lib/types/api";

export interface Engagement {
    id: string;
    ligneCreditId?: string;
    typeFinancement: string;
    montant?: number;
    devise?: string;
    dateEngagement?: string;
    dateEcheance?: string;
    statut: string;
    referenceDossier: string;
    workflowTemplateId?: string;
    workflowStepId?: string;
    parentEngagementId?: string;
    createdAt?: string;
    updatedAt?: string;
    // Relations (populated if requested)
    workflowTemplate?: any;
    workflowStep?: any;
    ligneCredit?: any;
}

export interface CreateEngagementRequest {
    ligneCreditId?: string;
    workflowTemplateId: string;
    montant?: number;
    devise?: string;
    dateEngagement?: string;
    dateEcheance?: string;
    formData?: Record<string, any>; // Additional fields from template
}

/**
 * Engagements Service
 * Handles all engagement-related API calls
 */
export class EngagementsService {
    /**
     * Fetch all engagements
     */
    static async getEngagements(params?: {
        status?: string;
        templateId?: string;
    }): Promise<Engagement[]> {
        try {
            const queryParams = new URLSearchParams();
            if (params?.status) queryParams.append("status", params.status);
            if (params?.templateId) queryParams.append("templateId", params.templateId);

            const url = `/api/dashboard/engagements?${queryParams.toString()}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch engagements");
            }

            // Check if data has a 'data' property (backend format) or is the array itself
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            } else if (Array.isArray(data)) {
                return data;
            }

            return [];
        } catch (error) {
            console.error("Error fetching engagements:", error);
            throw error;
        }
    }

    /**
     * Get a single engagement by ID
     */
    static async getEngagementById(id: string): Promise<Engagement> {
        try {
            const response = await fetch(`/api/dashboard/engagements/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch engagement");
            }

            if (data.data) {
                return data.data;
            }

            return data;
        } catch (error) {
            console.error("Error fetching engagement:", error);
            throw error;
        }
    }

    /**
     * Create a new engagement
     */
    static async createEngagement(
        request: CreateEngagementRequest
    ): Promise<Engagement> {
        try {
            const response = await fetch("/api/dashboard/engagements", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            const data: ApiResponse<Engagement> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create engagement");
            }

            return data.data!;
        } catch (error) {
            console.error("Error creating engagement:", error);
            throw error;
        }
    }

    /**
     * Move engagement to next workflow step
     */
    static async moveToNextStep(
        engagementId: string,
        stepData?: { fieldData?: Record<string, any>; documents?: string[] }
    ): Promise<Engagement> {
        try {
            const response = await fetch(
                `/api/dashboard/engagements/${engagementId}/next-step`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(stepData || {}),
                }
            );

            const result: ApiResponse<Engagement> = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to move to next step");
            }

            return result.data!;
        } catch (error) {
            console.error("Error moving to next step:", error);
            throw error;
        }
    }

    /**
     * Update an existing engagement
     */
    static async updateEngagement(
        id: string,
        updates: Partial<Engagement>
    ): Promise<Engagement> {
        try {
            const response = await fetch(`/api/dashboard/engagements/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updates),
            });

            const data: ApiResponse<Engagement> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update engagement");
            }

            return data.data!;
        } catch (error) {
            console.error("Error updating engagement:", error);
            throw error;
        }
    }

    /**
     * Delete an engagement
     */
    static async deleteEngagement(id: string): Promise<void> {
        try {
            const response = await fetch(`/api/dashboard/engagements/${id}`, {
                method: "DELETE",
            });

            const data: ApiResponse<any> = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to delete engagement");
            }
        } catch (error) {
            console.error("Error deleting engagement:", error);
            throw error;
        }
    }

    /**
     * Get step completion history for an engagement
     */
    static async getStepCompletions(engagementId: string): Promise<any[]> {
        try {
            const response = await fetch(`/api/dashboard/engagements/${engagementId}/step-completions`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch step completions");
            }

            return data.data || [];
        } catch (error) {
            console.error("Error fetching step completions:", error);
            throw error;
        }
    }

    /**
     * Get complete engagement history with audit trail
     */
    static async getEngagementHistory(engagementId: string): Promise<any> {
        try {
            const response = await fetch(`/api/dashboard/engagements/${engagementId}/history`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch engagement history");
            }

            return data.data;
        } catch (error) {
            console.error("Error fetching engagement history:", error);
            throw error;
        }
    }
}
