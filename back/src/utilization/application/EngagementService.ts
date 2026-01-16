import { PrismaClient } from '../../identity/infrastructure/persistence/prisma/client';

export class EngagementService {
    constructor(private prisma: PrismaClient) { }

    /**
     * Get all engagements (with optional filters)
     */
    async getAllEngagements(filters?: { status?: string; templateId?: string }) {
        return await this.prisma.engagement.findMany({
            where: {
                ...(filters?.status ? { statut: filters.status } : {}),
                ...(filters?.templateId ? { workflowTemplateId: filters.templateId } : {}),
            },
            include: {
                workflowTemplate: true,
                workflowStep: true,
                ligneCredit: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Get engagement by ID
     */
    async getEngagementById(id: string) {
        const engagement = await this.prisma.engagement.findUnique({
            where: { id },
            include: {
                workflowTemplate: {
                    include: {
                        steps: {
                            orderBy: {
                                stepOrder: 'asc',
                            },
                        },
                    },
                },
                workflowStep: true,
                ligneCredit: true,
            },
        });

        if (!engagement) {
            throw new Error(`Engagement with ID ${id} not found`);
        }

        return engagement;
    }

    /**
     * Create a new engagement
     */
    async createEngagement(data: {
        ligneCreditId?: string; // Optional
        workflowTemplateId: string;
        montant?: number;
        devise?: string;
        dateEngagement?: string;
        dateEcheance?: string;
        formData?: Record<string, any>;
    }) {
        // Get template to determine typeFinancement and first step
        const template = await this.prisma.workflowTemplate.findUnique({
            where: { id: data.workflowTemplateId },
            include: {
                steps: {
                    orderBy: {
                        stepOrder: 'asc',
                    },
                },
            },
        });

        if (!template) {
            throw new Error(`Workflow template with ID ${data.workflowTemplateId} not found`);
        }

        // Get first step
        const firstStep = template.steps[0];

        // Generate reference dossier
        const referenceDossier = `${template.code}-${Date.now()}`;

        // Create engagement
        const engagement = await this.prisma.engagement.create({
            data: {
                ligneCreditId: data.ligneCreditId || undefined,
                workflowTemplateId: data.workflowTemplateId,
                workflowStepId: firstStep?.id || null,
                typeFinancement: template.code,
                montant: data.montant || null,
                devise: data.devise || 'USD',
                dateEngagement: data.dateEngagement ? new Date(data.dateEngagement) : undefined,
                dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : undefined,
                statut: 'EN_COURS',
                referenceDossier,
            },
            include: {
                workflowTemplate: true,
                workflowStep: true,
                ligneCredit: true,
            },
        });

        return engagement;
    }

    /**
     * Update engagement
     */
    async updateEngagement(id: string, updates: any) {
        const engagement = await this.prisma.engagement.findUnique({
            where: { id },
        });

        if (!engagement) {
            throw new Error(`Engagement with ID ${id} not found`);
        }

        return await this.prisma.engagement.update({
            where: { id },
            data: updates,
            include: {
                workflowTemplate: true,
                workflowStep: true,
                ligneCredit: true,
            },
        });
    }

    /**
     * Delete engagement
     */
    async deleteEngagement(id: string) {
        const engagement = await this.prisma.engagement.findUnique({
            where: { id },
        });

        if (!engagement) {
            throw new Error(`Engagement with ID ${id} not found`);
        }

        await this.prisma.engagement.delete({
            where: { id },
        });
    }

    /**
     * Move engagement to next workflow step
     */
    async moveToNextStep(
        id: string,
        stepData?: { fieldData?: Record<string, any>; documents?: string[] },
        userId?: string
    ) {
        // Get engagement with template and current step
        const engagement = await this.prisma.engagement.findUnique({
            where: { id },
            include: {
                workflowTemplate: {
                    include: {
                        steps: {
                            orderBy: {
                                stepOrder: 'asc',
                            },
                        },
                    },
                },
                workflowStep: true,
            },
        });

        if (!engagement) {
            throw new Error(`Engagement with ID ${id} not found`);
        }

        if (!engagement.workflowTemplate) {
            throw new Error(`Engagement ${id} has no workflow template`);
        }

        // Find current step index
        const currentStepIndex = engagement.workflowTemplate.steps.findIndex(
            (s) => s.id === engagement.workflowStepId
        );

        if (currentStepIndex === -1) {
            throw new Error(`Current step not found in template`);
        }

        const currentStep = engagement.workflowTemplate.steps[currentStepIndex];

        // Save step completion record
        if (currentStep) {
            await this.prisma.stepCompletion.create({
                data: {
                    engagementId: id,
                    workflowStepId: currentStep.id,
                    fieldData: stepData?.fieldData ? JSON.stringify(stepData.fieldData) : null,
                    documents: stepData?.documents ? JSON.stringify(stepData.documents) : null,
                    completedBy: userId || null,
                    completedAt: new Date(),
                },
            });
        }

        // Check if there's a next step
        const nextStep = engagement.workflowTemplate.steps[currentStepIndex + 1];

        if (!nextStep) {
            // Last step - mark as completed and clear workflowStepId
            return await this.prisma.engagement.update({
                where: { id },
                data: {
                    statut: 'REGLE',
                    workflowStepId: null, // Clear the step ID when workflow is complete
                },
                include: {
                    workflowTemplate: {
                        include: {
                            steps: {
                                orderBy: {
                                    stepOrder: 'asc',
                                },
                            },
                        },
                    },
                    workflowStep: true,
                    ligneCredit: true,
                },
            });
        }

        // Move to next step
        return await this.prisma.engagement.update({
            where: { id },
            data: {
                workflowStepId: nextStep.id,
            },
            include: {
                workflowTemplate: {
                    include: {
                        steps: {
                            orderBy: {
                                stepOrder: 'asc',
                            },
                        },
                    },
                },
                workflowStep: true,
                ligneCredit: true,
            },
        });
    }

    /**
     * Get step completion history for an engagement
     */
    async getStepCompletions(engagementId: string) {
        const completions = await this.prisma.stepCompletion.findMany({
            where: {
                engagementId,
            },
            include: {
                workflowStep: true,
            },
            orderBy: {
                completedAt: 'asc',
            },
        });

        return completions.map(completion => ({
            ...completion,
            fieldData: completion.fieldData ? JSON.parse(completion.fieldData) : null,
            documents: completion.documents ? JSON.parse(completion.documents) : [],
        }));
    }

    /**
     * Get complete engagement history with audit trail
     */
    async getEngagementHistory(engagementId: string) {
        const engagement = await this.prisma.engagement.findUnique({
            where: { id: engagementId },
            include: {
                ligneCredit: {
                    include: {
                        banque: true,
                    },
                },
                workflowTemplate: {
                    include: {
                        steps: {
                            orderBy: {
                                stepOrder: 'asc',
                            },
                        },
                    },
                },
                stepCompletions: {
                    include: {
                        workflowStep: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                // : true,
                                email: true,
                            },
                        },
                    },
                    orderBy: {
                        completedAt: 'asc',
                    },
                },
            },
        });

        if (!engagement) {
            throw new Error(`Engagement with ID ${engagementId} not found`);
        }

        // Parse JSON fields
        const stepCompletions = (engagement as any).stepCompletions.map((completion: any) => ({
            ...completion,
            fieldData: completion.fieldData ? JSON.parse(completion.fieldData) : null,
            documents: completion.documents ? JSON.parse(completion.documents) : [],
        }));

        return {
            ...engagement,
            stepCompletions,
        };
    }
}
