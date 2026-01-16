import { bffClient } from "@/lib/api/client";
import { ApiResponse } from "../types/api";

export interface WorkflowInstance {
    id: string;
    workflowDefinitionId: string;
    currentStepId: string;
    entityType: string;
    entityId: string;
    status: string;
    referenceNo?: string;
    data?: any;
    startedByUserId: string;
    startedAt: string;
    lastUpdatedAt: string;
    completedAt?: string;
    currentStep?: {
        name: string;
        label: string;
    };
    workflowDefinition?: {
        name: string;
    };
}

export interface WorkflowAction {
    name: string;
    label: string;
    toStep: string;
}

export class WorkflowService {
    /**
     * Start a new workflow
     */
    static async startWorkflow(
        workflowName: string,
        entityType: string,
        entityId: string,
        initialData?: any
    ): Promise<WorkflowInstance> {
        try {
            const data = await bffClient.post<WorkflowInstance>("/api/dashboard/workflows/start", {
                workflowName,
                entityType,
                entityId,
                initialData,
            });

            return data;
        } catch (error) {
            console.error("Error starting workflow:", error);
            throw error;
        }
    }

    /**
     * Get all workflows
     */
    static async getWorkflows(): Promise<WorkflowInstance[]> {
        try {
            const data = await bffClient.get<WorkflowInstance[]>("/api/dashboard/workflows");
            return data;
        } catch (error) {
            console.error("Error fetching workflows:", error);
            throw error;
        }
    }

    /**
     * Get workflow status and available actions
     */
    static async getWorkflowStatus(id: string): Promise<{
        instanceId: string;
        availableActions: WorkflowAction[];
    }> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/workflows/${id}`);
            return data;
        } catch (error) {
            console.error("Error fetching workflow status:", error);
            throw error;
        }
    }

    /**
     * Execute a transition
     */
    static async executeTransition(
        id: string,
        action: string,
        data?: any
    ): Promise<WorkflowInstance> {
        try {
            const responseData = await bffClient.post<WorkflowInstance>(`/api/dashboard/workflows/${id}/transition`, {
                action,
                data,
            });

            return responseData;
        } catch (error) {
            console.error("Error executing transition:", error);
            throw error;
        }
    }
    /**
     * Get all workflow definitions
     */
    static async getDefinitions(): Promise<any[]> {
        try {
            const data = await bffClient.get<any[]>("/api/dashboard/workflows/definitions");
            return data;
        } catch (error) {
            console.error("Error fetching definitions:", error);
            throw error;
        }
    }

    /**
     * Create a new workflow definition
     */
    static async createDefinition(name: string, description?: string): Promise<any> {
        try {
            const data = await bffClient.post<any>("/api/dashboard/workflows/definitions", {
                name,
                description,
            });
            return data;
        } catch (error) {
            console.error("Error creating definition:", error);
            throw error;
        }
    }

    /**
     * Get definition by ID
     */
    static async getDefinitionById(id: string): Promise<any> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/workflows/definitions/${id}`);
            return data;
        } catch (error) {
            console.error("Error fetching definition:", error);
            throw error;
        }
    }

    /**
     * Add step to definition
     */
    static async addStep(definitionId: string, step: any): Promise<any> {
        try {
            const data = await bffClient.post<any>(`/api/dashboard/workflows/definitions/${definitionId}/steps`, step);
            return data;
        } catch (error) {
            console.error("Error adding step:", error);
            throw error;
        }
    }
}
