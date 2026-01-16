import { bffClient } from '@/lib/api/client';

export interface FormFieldSchema {
    name: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'relation' | 'file';
    label: string;
    required: boolean;
    options?: string[];
    defaultValue?: any;
    min?: number;
    max?: number;
    step?: number;
    relationTo?: string;
    helpText?: string;
}

export interface FormSchema {
    fields: FormFieldSchema[];
}

// Step-level field configuration
export interface StepFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'relation' | 'textarea' | 'checkbox' | 'calculated';
    required?: boolean;
    placeholder?: string;
    relationTo?: 'banks' | 'companies' | 'suppliers' | 'clients';
    options?: string[];
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
    };
    // Calculation support
    formula?: string;          // JavaScript expression
    calculatedFrom?: string[]; // Field dependencies
    readonly?: boolean;        // Calculated fields are read-only
}

export interface WorkflowStep {
    id: string;
    templateId: string;
    stepOrder: number;
    code: string;
    label: string;
    description: string | null;
    requiredFields: StepFieldConfig[] | string[] | null; // Support both formats
    requiredDocuments: string[] | null;
    requiresApproval: boolean;
    approvalRoles: string[] | null;
    triggerAction: string | null;
    icon: string | null;
    color: string | null;
    allowedRoles: string[] | null;
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowTemplate {
    id: string;
    code: string;
    label: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    displayOrder: number;
    formSchema: FormSchema | null;
    isActive: boolean;
    steps: WorkflowStep[];
    createdAt: string;
    updatedAt: string;
}

/**
 * Workflow Template Service
 * Handles all API calls for workflow templates
 */
export class WorkflowTemplateService {
    /**
     * Fetch all templates
     */
    static async getAllTemplates(): Promise<WorkflowTemplate[]> {
        try {
            const data = await bffClient.get<any>('/api/dashboard/workflows/templates');

            let templates: any[] = [];

            // Backend format check
            if (data.data && Array.isArray(data.data)) {
                templates = data.data;
            } else if (Array.isArray(data)) {
                templates = data;
            }

            return templates as WorkflowTemplate[];
        } catch (error) {
            console.error('Error fetching templates:', error);
            throw error;
        }
    }

    /**
     * Get a single template by ID
     */
    static async getTemplateById(id: string): Promise<WorkflowTemplate> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/workflows/templates?id=${id}`);

            // Handle both wrapped and unwrapped responses
            const templateData = data.data || data;

            return templateData as WorkflowTemplate;
        } catch (error) {
            console.error('Error fetching template:', error);
            throw error;
        }
    }

    /**
     * Get template by code (LC, AS, AF, RD, CMT)
     */
    static async getTemplateByCode(code: string): Promise<WorkflowTemplate> {
        try {
            const data = await bffClient.get<any>(`/api/dashboard/workflows/templates?code=${code}`);

            // Handle both wrapped and unwrapped responses
            const templateData = data.data || data;

            return templateData as WorkflowTemplate;
        } catch (error) {
            console.error('Error fetching template by code:', error);
            throw error;
        }
    }

    /**
     * Create a new template
     */
    static async createTemplate(templateData: {
        code: string;
        label: string;
        description?: string;
        formSchema?: FormSchema;
        icon?: string;
        color?: string;
    }): Promise<WorkflowTemplate> {
        try {
            const result = await bffClient.post<any>('/api/dashboard/workflows/templates', templateData);

            return result.data || result;
        } catch (error) {
            console.error('Error creating template:', error);
            throw error;
        }
    }

    /**
     * Update an existing template
     */
    static async updateTemplate(
        id: string,
        templateData: Partial<Omit<WorkflowTemplate, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'steps'>>
    ): Promise<WorkflowTemplate> {
        try {
            const result = await bffClient.put<any>(`/api/dashboard/workflows/templates?id=${id}`, templateData);

            return result.data || result;
        } catch (error) {
            console.error('Error updating template:', error);
            throw error;
        }
    }

    /**
     * Delete a template
     */
    static async deleteTemplate(id: string): Promise<void> {
        try {
            await bffClient.delete(`/api/dashboard/workflows/templates?id=${id}`);
        } catch (error) {
            console.error('Error deleting template:', error);
            throw error;
        }
    }

    /**
     * Add a step to a template
     */
    static async addStep(
        templateId: string,
        stepData: {
            code: string;
            label: string;
            stepOrder: number;
            description?: string;
            requiredFields?: string[];
            requiredDocuments?: string[];
            requiresApproval?: boolean;
            approvalRoles?: string[];
            triggerAction?: string;
            icon?: string;
            color?: string;
            allowedRoles?: string[];
        }
    ): Promise<WorkflowStep> {
        try {
            const result = await bffClient.post<any>(`/api/dashboard/workflows/templates/steps?templateId=${templateId}`, stepData);

            return result.data || result;
        } catch (error) {
            console.error('Error adding step:', error);
            throw error;
        }
    }

    /**
     * Update a workflow step
     */
    static async updateStep(
        stepId: string,
        stepData: Partial<Omit<WorkflowStep, 'id' | 'templateId' | 'code' | 'createdAt' | 'updatedAt'>>
    ): Promise<WorkflowStep> {
        try {
            const result = await bffClient.put<any>(`/api/dashboard/workflows/steps?id=${stepId}`, stepData);

            return result.data || result;
        } catch (error) {
            console.error('Error updating step:', error);
            throw error;
        }
    }

    /**
     * Delete a workflow step
     */
    static async deleteStep(stepId: string): Promise<void> {
        try {
            await bffClient.delete(`/api/dashboard/workflows/steps?id=${stepId}`);
        } catch (error) {
            console.error('Error deleting step:', error);
            throw error;
        }
    }
}
