import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { IWorkflowTemplateRepository } from '../../domain/IWorkflowTemplateRepository';
import { WorkflowTemplate, WorkflowStep, FormSchema } from '../../domain/WorkflowTemplate';

export class PrismaWorkflowTemplateRepository implements IWorkflowTemplateRepository {
    constructor(private prisma: PrismaClient) { }

    async findAll(): Promise<WorkflowTemplate[]> {
        const templates = await this.prisma.workflowTemplate.findMany({
            include: { steps: { orderBy: { stepOrder: 'asc' } } },
            orderBy: { displayOrder: 'asc' },
        });
        return templates.map(t => this.toDomain(t));
    }

    async findByCode(code: string): Promise<WorkflowTemplate | null> {
        const template = await this.prisma.workflowTemplate.findUnique({
            where: { code },
            include: { steps: { orderBy: { stepOrder: 'asc' } } },
        });
        return template ? this.toDomain(template) : null;
    }

    async findById(id: string): Promise<WorkflowTemplate | null> {
        const template = await this.prisma.workflowTemplate.findUnique({
            where: { id },
            include: { steps: { orderBy: { stepOrder: 'asc' } } },
        });
        return template ? this.toDomain(template) : null;
    }

    async save(template: WorkflowTemplate): Promise<WorkflowTemplate> {
        const created = await this.prisma.workflowTemplate.create({
            data: {
                id: template.id,
                code: template.code,
                label: template.label,
                description: template.description,
                icon: template.icon,
                color: template.color,
                displayOrder: template.displayOrder,
                formSchema: template.formSchema as any,
                isActive: template.isActive,
            },
            include: { steps: true },
        });
        return this.toDomain(created);
    }

    async update(id: string, data: Partial<WorkflowTemplate>): Promise<WorkflowTemplate> {
        const updated = await this.prisma.workflowTemplate.update({
            where: { id },
            data: {
                label: data.label,
                description: data.description,
                icon: data.icon,
                color: data.color,
                displayOrder: data.displayOrder,
                formSchema: data.formSchema as any,
                isActive: data.isActive,
            },
            include: { steps: { orderBy: { stepOrder: 'asc' } } },
        });
        return this.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.workflowTemplate.delete({ where: { id } });
    }

    async findStepsByTemplateId(templateId: string): Promise<WorkflowStep[]> {
        const steps = await this.prisma.workflowStep.findMany({
            where: { workflowTemplateId: templateId },
            orderBy: { stepOrder: 'asc' },
        });
        return steps.map(s => this.stepToDomain(s));
    }

    async findStepById(stepId: string): Promise<WorkflowStep | null> {
        const step = await this.prisma.workflowStep.findUnique({ where: { id: stepId } });
        return step ? this.stepToDomain(step) : null;
    }

    async saveStep(step: WorkflowStep): Promise<WorkflowStep> {
        const created = await this.prisma.workflowStep.create({
            data: {
                id: step.id,
                workflowTemplateId: step.templateId,
                stepOrder: step.stepOrder,
                code: step.code,
                label: step.label,
                description: step.description,
                requiredFields: step.requiredFields as any,
                requiredDocuments: step.requiredDocuments as any,
                requiresApproval: step.requiresApproval,
                approvalRoles: step.approvalRoles as any,
                triggerAction: step.triggerAction,
                icon: step.icon,
                color: step.color,
                allowedRoles: step.allowedRoles as any,
            },
        });
        return this.stepToDomain(created);
    }

    async updateStep(stepId: string, data: Partial<WorkflowStep>): Promise<WorkflowStep> {
        const updated = await this.prisma.workflowStep.update({
            where: { id: stepId },
            data: {
                stepOrder: data.stepOrder,
                label: data.label,
                description: data.description,
                requiredFields: data.requiredFields as any,
                requiredDocuments: data.requiredDocuments as any,
                requiresApproval: data.requiresApproval,
                approvalRoles: data.approvalRoles as any,
                triggerAction: data.triggerAction,
                icon: data.icon,
                color: data.color,
                allowedRoles: data.allowedRoles as any,
            },
        });
        return this.stepToDomain(updated);
    }

    async deleteStep(stepId: string): Promise<void> {
        await this.prisma.workflowStep.delete({ where: { id: stepId } });
    }

    // Mappers
    private toDomain(prismaTemplate: any): WorkflowTemplate {
        return new WorkflowTemplate(
            prismaTemplate.id,
            prismaTemplate.code,
            prismaTemplate.label,
            prismaTemplate.description,
            prismaTemplate.icon,
            prismaTemplate.color,
            prismaTemplate.displayOrder,
            prismaTemplate.formSchema as FormSchema | null,
            prismaTemplate.isActive,
            (prismaTemplate.steps || []).map((s: any) => this.stepToDomain(s)),
            prismaTemplate.createdAt,
            prismaTemplate.updatedAt
        );
    }

    private stepToDomain(prismaStep: any): WorkflowStep {
        return new WorkflowStep(
            prismaStep.id,
            prismaStep.workflowTemplateId,
            prismaStep.stepOrder,
            prismaStep.code,
            prismaStep.label,
            prismaStep.description,
            prismaStep.requiredFields as (import('../../domain/WorkflowTemplate').StepFieldConfig[] | string[] | null),
            prismaStep.requiredDocuments as string[] | null,
            prismaStep.requiresApproval,
            prismaStep.approvalRoles as string[] | null,
            prismaStep.triggerAction,
            prismaStep.icon,
            prismaStep.color,
            prismaStep.allowedRoles as string[] | null,
            prismaStep.createdAt,
            prismaStep.updatedAt
        );
    }
}
