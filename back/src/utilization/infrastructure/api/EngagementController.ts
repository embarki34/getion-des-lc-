import { Request, Response } from 'express';
import { EngagementService } from '../../application/EngagementService';

/**
 * API Controller for Engagements
 * Handles CRUD operations and workflow transitions
 */
export class EngagementController {
    constructor(private service: EngagementService) { }

    // GET /api/engagements
    listEngagements = async (req: Request, res: Response): Promise<void> => {
        try {
            const { status, templateId } = req.query;

            const engagements = await this.service.getAllEngagements({
                status: status as string | undefined,
                templateId: templateId as string | undefined,
            });

            res.json(engagements);
        } catch (error: any) {
            console.error('Error listing engagements:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    };

    // GET /api/engagements/:id
    getEngagement = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const engagement = await this.service.getEngagementById(id);
            res.json(engagement);
        } catch (error: any) {
            console.error('Error fetching engagement:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // POST /api/engagements
    createEngagement = async (req: Request, res: Response): Promise<void> => {
        try {
            const {
                ligneCreditId,
                workflowTemplateId,
                montant,
                devise,
                dateEngagement,
                dateEcheance,
                formData,
            } = req.body;

            // Validate required fields
            if (!workflowTemplateId) {
                res.status(400).json({
                    message: 'workflowTemplateId is required',
                });
                return;
            }
            if (!ligneCreditId) {
                res.status(400).json({
                    message: 'ligneCreditId is required - please ensure the template includes a credit line field',
                });
                return;
            }
            // Validation relaxed - data driven by template
            // if (!montant || isNaN(montant)) { ... }

            const engagement = await this.service.createEngagement({
                ligneCreditId: ligneCreditId || null, // Optional - not all workflows need credit lines
                workflowTemplateId,
                montant,
                devise,
                dateEngagement,
                dateEcheance,
                formData,
            });

            res.status(201).json(engagement);
        } catch (error: any) {
            console.error('Error creating engagement:', error);
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    };

    // PUT /api/engagements/:id
    updateEngagement = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const engagement = await this.service.updateEngagement(id, req.body);
            res.json(engagement);
        } catch (error: any) {
            console.error('Error updating engagement:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // DELETE /api/engagements/:id
    deleteEngagement = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.service.deleteEngagement(id);
            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting engagement:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // POST /api/engagements/:id/next-step
    moveToNextStep = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id || (req as any).user?.sub; // Extract user ID from token

            const engagement = await this.service.moveToNextStep(id, req.body, userId);
            res.json(engagement);
        } catch (error: any) {
            console.error('Error moving to next step:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ message: error.message });
            } else {
                res.status(500).json({ message: error.message || 'Internal Server Error' });
            }
        }
    };

    // GET /api/engagements/:id/step-completions
    getStepCompletions = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const completions = await this.service.getStepCompletions(id);
            res.json({
                success: true,
                data: completions,
            });
        } catch (error: any) {
            console.error('Get step completions error:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to fetch step completions',
            });
        }
    };

    // GET /api/engagements/:id/history
    getEngagementHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const history = await this.service.getEngagementHistory(id);
            res.json({
                success: true,
                data: history,
            });
        } catch (error: any) {
            console.error('Get engagement history error:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({
                    success: false,
                    message: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: error.message || 'Failed to fetch engagement history',
                });
            }
        }
    };
}
