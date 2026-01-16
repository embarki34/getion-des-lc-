import { IWorkflowTemplateRepository } from '../domain/IWorkflowTemplateRepository';
import { WorkflowTemplate, WorkflowStep, FormSchema } from '../domain/WorkflowTemplate';
import { v4 as uuidv4 } from 'uuid';

/**
 * Application Service for Workflow Templates
 * Handles business logic for template management
 */
export class WorkflowTemplateService {
    constructor(private repository: IWorkflowTemplateRepository) { }

    // Template Operations
    async getAllTemplates(): Promise<WorkflowTemplate[]> {
        return this.repository.findAll();
    }

    async getTemplateByCode(code: string): Promise<WorkflowTemplate | null> {
        return this.repository.findByCode(code);
    }

    async getTemplateById(id: string): Promise<WorkflowTemplate | null> {
        return this.repository.findById(id);
    }

    async createTemplate(
        code: string,
        label: string,
        description?: string,
        formSchema?: FormSchema,
        icon?: string,
        color?: string
    ): Promise<WorkflowTemplate> {
        // Check if code already exists
        const existing = await this.repository.findByCode(code);
        if (existing) {
            throw new Error(`Template with code '${code}' already exists`);
        }

        const template = new WorkflowTemplate(
            uuidv4(),
            code,
            label,
            description || null,
            icon || null,
            color || null,
            0,
            formSchema || null,
            true,
            [],
            new Date(),
            new Date()
        );

        return this.repository.save(template);
    }

    async updateTemplate(
        id: string,
        data: {
            label?: string;
            description?: string;
            formSchema?: FormSchema;
            icon?: string;
            color?: string;
            displayOrder?: number;
            isActive?: boolean;
        }
    ): Promise<WorkflowTemplate> {
        const template = await this.repository.findById(id);
        if (!template) {
            throw new Error(`Template with id '${id}' not found`);
        }

        return this.repository.update(id, data as Partial<WorkflowTemplate>);
    }

    async deleteTemplate(id: string): Promise<void> {
        const template = await this.repository.findById(id);
        if (!template) {
            throw new Error(`Template with id '${id}' not found`);
        }

        await this.repository.delete(id);
    }

    // Step Operations
    async addStepToTemplate(
        templateId: string,
        code: string,
        label: string,
        stepOrder: number,
        options: {
            description?: string;
            requiredFields?: string[];
            requiredDocuments?: string[];
            requiresApproval?: boolean;
            approvalRoles?: string[];
            triggerAction?: string;
            icon?: string;
            color?: string;
            allowedRoles?: string[];
        } = {}
    ): Promise<WorkflowStep> {
        const template = await this.repository.findById(templateId);
        if (!template) {
            throw new Error(`Template with id '${templateId}' not found`);
        }

        const step = new WorkflowStep(
            uuidv4(),
            templateId,
            stepOrder,
            code,
            label,
            options.description || null,
            options.requiredFields || null,
            options.requiredDocuments || null,
            options.requiresApproval || false,
            options.approvalRoles || null,
            options.triggerAction || null,
            options.icon || null,
            options.color || null,
            options.allowedRoles || null,
            new Date(),
            new Date()
        );

        return this.repository.saveStep(step);
    }

    async updateStep(
        stepId: string,
        data: Partial<Omit<WorkflowStep, 'id' | 'templateId' | 'createdAt' | 'updatedAt' | 'code'>>
    ): Promise<WorkflowStep> {
        const step = await this.repository.findStepById(stepId);
        if (!step) {
            throw new Error(`Step with id '${stepId}' not found`);
        }

        return this.repository.updateStep(stepId, data);
    }

    async deleteStep(stepId: string): Promise<void> {
        const step = await this.repository.findStepById(stepId);
        if (!step) {
            throw new Error(`Step with id '${stepId}' not found`);
        }

        await this.repository.deleteStep(stepId);
    }

    async getStepsByTemplate(templateId: string): Promise<WorkflowStep[]> {
        return this.repository.findStepsByTemplateId(templateId);
    }
}
