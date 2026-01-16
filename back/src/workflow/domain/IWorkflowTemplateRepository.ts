import { WorkflowTemplate, WorkflowStep } from './WorkflowTemplate';

/**
 * Repository Interface for Workflow Templates
 */
export interface IWorkflowTemplateRepository {
    // Templates
    findAll(): Promise<WorkflowTemplate[]>;
    findByCode(code: string): Promise<WorkflowTemplate | null>;
    findById(id: string): Promise<WorkflowTemplate | null>;
    save(template: WorkflowTemplate): Promise<WorkflowTemplate>;
    update(id: string, data: Partial<WorkflowTemplate>): Promise<WorkflowTemplate>;
    delete(id: string): Promise<void>;

    // Steps
    findStepsByTemplateId(templateId: string): Promise<WorkflowStep[]>;
    findStepById(stepId: string): Promise<WorkflowStep | null>;
    saveStep(step: WorkflowStep): Promise<WorkflowStep>;
    updateStep(stepId: string, data: Partial<WorkflowStep>): Promise<WorkflowStep>;
    deleteStep(stepId: string): Promise<void>;
}
