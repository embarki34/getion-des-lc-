import { Request, Response } from 'express';
import { WorkflowTemplateService } from '../../application/WorkflowTemplateService';

/**
 * API Controller for Workflow Templates (Admin)
 * Handles CRUD operations for templates and steps
 */
export class WorkflowTemplateController {
    constructor(private service: WorkflowTemplateService) { }

    // GET /api/workflow/templates
    listTemplates = async (req: Request, res: Response): Promise<void> => {
        try {
            const templates = await this.service.getAllTemplates();
            res.json(templates);
        } catch (error: any) {
            console.error('Error listing templates:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    };

    // GET /api/workflow/templates/:id
    getTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const template = await this.service.getTemplateById(id);

            if (!template) {
                res.status(404).json({ message: 'Template not found' });
                return;
            }

            res.json(template);
        } catch (error: any) {
            console.error('Error fetching template:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    };

    // GET /api/workflow/templates/code/:code
    getTemplateByCode = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code } = req.params;
            const template = await this.service.getTemplateByCode(code);

            if (!template) {
                res.status(404).json({ message: 'Template not found' });
                return;
            }

            res.json(template);
        } catch (error: any) {
            console.error('Error fetching template by code:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    };

    // POST /api/workflow/templates
    createTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { code, label, description, formSchema, icon, color } = req.body;

            if (!code || !label) {
                res.status(400).json({ message: 'Code and label are required' });
                return;
            }

            const template = await this.service.createTemplate(
                code,
                label,
                description,
                formSchema,
                icon,
                color
            );

            res.status(201).json(template);
        } catch (error: any) {
            console.error('Error creating template:', error);
            if (error.message.includes('already exists')) {
                res.status(409).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // PUT /api/workflow/templates/:id
    updateTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const { label, description, formSchema, icon, color, displayOrder, isActive } = req.body;

            const template = await this.service.updateTemplate(id, {
                label,
                description,
                formSchema,
                icon,
                color,
                displayOrder,
                isActive,
            });

            res.json(template);
        } catch (error: any) {
            console.error('Error updating template:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // DELETE /api/workflow/templates/:id
    deleteTemplate = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.service.deleteTemplate(id);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting template:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // POST /api/workflow/templates/:id/steps
    addStep = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id: templateId } = req.params;
            const {
                code,
                label,
                stepOrder,
                description,
                requiredFields,
                requiredDocuments,
                requiresApproval,
                approvalRoles,
                triggerAction,
                icon,
                color,
                allowedRoles,
            } = req.body;

            if (!code || !label || stepOrder === undefined) {
                res.status(400).json({ message: 'Code, label, and stepOrder are required' });
                return;
            }

            const step = await this.service.addStepToTemplate(templateId, code, label, stepOrder, {
                description,
                requiredFields,
                requiredDocuments,
                requiresApproval,
                approvalRoles,
                triggerAction,
                icon,
                color,
                allowedRoles,
            });

            res.status(201).json(step);
        } catch (error: any) {
            console.error('Error adding step:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // PUT /api/workflow/steps/:stepId
    updateStep = async (req: Request, res: Response): Promise<void> => {
        try {
            const { stepId } = req.params;
            const step = await this.service.updateStep(stepId, req.body);
            res.json(step);
        } catch (error: any) {
            console.error('Error updating step:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // DELETE /api/workflow/steps/:stepId
    deleteStep = async (req: Request, res: Response): Promise<void> => {
        try {
            const { stepId } = req.params;
            await this.service.deleteStep(stepId);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting step:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };
}
