"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { EngagementsService, Engagement } from '@/lib/services/engagements.service';
import { DocumentService } from '@/lib/services/document.service';
import { WorkflowTemplateService } from '@/lib/services/workflow/WorkflowTemplateService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft, Loader2, CheckCircle2, Circle, ArrowRight,
    FileText, Calendar, DollarSign, Building2, CreditCard, Download,
    Clock, User, Database
} from "lucide-react";
import Link from 'next/link';
import { StepCompletionDialog } from '@/components/workflow/StepCompletionDialog';
import { StepDetailsDialog } from '@/components/workflow/StepDetailsDialog';

export default function EngagementDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [engagement, setEngagement] = useState<Engagement | null>(null);
    const [template, setTemplate] = useState<any>(null);
    const [stepCompletions, setStepCompletions] = useState<any[]>([]);
    const [engagementHistory, setEngagementHistory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [transitioning, setTransitioning] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Dialog state
    const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState<any>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

    useEffect(() => {
        if (id) {
            loadEngagement();
        } else {
            setError('No engagement ID provided');
            setLoading(false);
        }
    }, [id]);

    const loadEngagement = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError(null);

            // Load engagement
            const data = await EngagementsService.getEngagementById(id);
            setEngagement(data);

            // Load template
            if (data.workflowTemplateId) {
                const templateData = await WorkflowTemplateService.getTemplateById(data.workflowTemplateId);
                setTemplate(templateData);
            }

            // Load step completions
            const completions = await EngagementsService.getStepCompletions(id);
            setStepCompletions(completions);

            // Load full history
            const history = await EngagementsService.getEngagementHistory(id);
            setEngagementHistory(history);
        } catch (err: any) {
            console.error('Failed to load engagement:', err);
            setError(err.message || 'Failed to load engagement details');
        } finally {
            setLoading(false);
        }
    };

    // Handle completed workflows where workflowStepId is null
    const currentStepIndex = engagement?.workflowStepId
        ? (template?.steps?.findIndex((s: any) => s.id === engagement.workflowStepId) ?? -1)
        : (engagement?.statut === 'REGLE' ? (template?.steps?.length ?? 0) : -1);
    const currentStep = template?.steps?.[currentStepIndex];

    const handleOpenCompletionDialog = () => {
        if (currentStep) {
            setSelectedStep(currentStep);
            setCompletionDialogOpen(true);
        }
    };

    const handleCompleteStep = async (data: Record<string, any>, files: File[]) => {
        if (!engagement) return;

        try {
            setTransitioning(true);

            // Upload files
            let documentIds: string[] = [];
            if (files.length > 0) {
                const uploadedDocs = await DocumentService.uploadDocuments(
                    files,
                    engagement.id,
                    currentStep?.id,
                    'AUTRE'
                );
                documentIds = uploadedDocs.map(doc => doc.id);
            }

            // Move to next step
            await EngagementsService.moveToNextStep(engagement.id, {
                fieldData: data,
                documents: documentIds,
            });

            await loadEngagement();
            setCompletionDialogOpen(false);
        } catch (err: any) {
            console.error('Failed to complete step:', err);
            throw err;
        } finally {
            setTransitioning(false);
        }
    };

    const handleViewStepDetails = (step: any, index: number) => {
        setSelectedStep({
            ...step,
            isCompleted: index < currentStepIndex,
            isCurrent: index === currentStepIndex,
        });
        setDetailsDialogOpen(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !engagement) {
        return (
            <div className="p-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center text-red-600">{error || 'Engagement not found'}</div>
                        <div className="mt-4 text-center">
                            <Link href="/engagements">
                                <Button variant="outline">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back to Engagements
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const isLastStep = currentStepIndex === (template?.steps?.length - 1);

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/engagements">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div className="flex-1">
                    <h2 className="text-3xl font-bold tracking-tight">{engagement.referenceDossier}</h2>
                    <p className="text-muted-foreground">{engagement.typeFinancement}</p>
                </div>
                <Badge
                    variant="secondary"
                    className={
                        engagement.statut === 'EN_COURS' ? 'bg-blue-500 text-white' :
                            engagement.statut === 'REGLE' ? 'bg-green-500 text-white' :
                                'bg-red-500 text-white'
                    }
                >
                    {engagement.statut}
                </Badge>
            </div>

            {/* Engagement Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Amount</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat().format(engagement.montant)}
                        </div>
                        <p className="text-xs text-muted-foreground">{engagement.devise}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Start Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(engagement.dateEngagement).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">End Date</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(engagement.dateEcheance).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Credit Line</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium">
                            {engagement.ligneCreditId}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs: Workflow / Step Details / Details & Audit */}
            <Tabs defaultValue="workflow" className="w-full">
                <TabsList>
                    <TabsTrigger value="workflow">Workflow Progress</TabsTrigger>
                    <TabsTrigger value="step-details">Step Details</TabsTrigger>
                    <TabsTrigger value="details">Details & Audit Trail</TabsTrigger>
                </TabsList>

                {/* Workflow Tab */}
                <TabsContent value="workflow" className="mt-6">
                    {/* ... existing workflow content ... */}
                </TabsContent>

                {/* Step Details Tab */}
                <TabsContent value="step-details" className="mt-6">
                    {/* ... existing step details content ... */}
                </TabsContent>

                {/* Details & Audit Trail Tab - NEW! */}
                <TabsContent value="details" className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Left Column - Engagement Information */}
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="h-5 w-5" />
                                        Engagement Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <span className="font-medium text-muted-foreground">Reference:</span>
                                        <span className="font-mono">{engagement.referenceDossier}</span>

                                        <span className="font-medium text-muted-foreground">Type:</span>
                                        <span>{engagement.typeFinancement}</span>

                                        <span className="font-medium text-muted-foreground">Amount:</span>
                                        <span className="font-semibold">{new Intl.NumberFormat().format(engagement.montant)} {engagement.devise}</span>

                                        <span className="font-medium text-muted-foreground">Status:</span>
                                        <Badge variant={engagement.statut === 'REGLE' ? 'default' : 'secondary'}>
                                            {engagement.statut}
                                        </Badge>

                                        <span className="font-medium text-muted-foreground">Start Date:</span>
                                        <span>{new Date(engagement.dateEngagement).toLocaleDateString()}</span>

                                        <span className="font-medium text-muted-foreground">End Date:</span>
                                        <span>{new Date(engagement.dateEcheance).toLocaleDateString()}</span>

                                        <span className="font-medium text-muted-foreground">Created:</span>
                                        <span>{engagement.createdAt ? new Date(engagement.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Credit Line Information */}
                            {engagementHistory?.ligneCredit && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <CreditCard className="h-5 w-5" />
                                            Credit Line Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <span className="font-medium text-muted-foreground">Reference:</span>
                                            <span className="font-mono">{engagementHistory.ligneCredit.reference}</span>

                                            <span className="font-medium text-muted-foreground">Type:</span>
                                            <span>{engagementHistory.ligneCredit.type}</span>

                                            <span className="font-medium text-muted-foreground">Amount:</span>
                                            <span>{new Intl.NumberFormat().format(engagementHistory.ligneCredit.montantAutorise)} {engagementHistory.ligneCredit.devise}</span>

                                            <span className="font-medium text-muted-foreground">Bank:</span>
                                            <span>{engagementHistory.ligneCredit.banque?.nom || 'N/A'}</span>

                                            <span className="font-medium text-muted-foreground">Status:</span>
                                            <Badge variant="secondary">{engagementHistory.ligneCredit.statut}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Workflow Template Info */}
                            {template && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="h-5 w-5" />
                                            Workflow Template
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-muted-foreground">Name:</span>
                                            <span>{template.name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-muted-foreground">Code:</span>
                                            <span className="font-mono">{template.code}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-muted-foreground">Total Steps:</span>
                                            <span>{template.steps?.length || 0}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-medium text-muted-foreground">Completed:</span>
                                            <span>{stepCompletions.length} / {template.steps?.length || 0}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Audit Trail Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5" />
                                    Audit Trail & Timeline
                                </CardTitle>
                                <CardDescription>Complete history of all actions and changes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative space-y-4">
                                    {/* Creation Event */}
                                    <div className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                                                <Database className="h-4 w-4" />
                                            </div>
                                            {(engagementHistory?.stepCompletions?.length > 0) && (
                                                <div className="w-0.5 h-full bg-gray-300 dark:bg-slate-700 mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-semibold">Engagement Created</h4>
                                                <span className="text-xs text-muted-foreground">
                                                    {engagement.createdAt ? new Date(engagement.createdAt).toLocaleString() : 'N/A'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Initial engagement setup with reference {engagement.referenceDossier}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step Completion Events */}
                                    {engagementHistory?.stepCompletions?.map((completion: any, index: number) => {
                                        const isLast = index === engagementHistory.stepCompletions.length - 1;
                                        return (
                                            <div key={completion.id} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </div>
                                                    {!isLast && (
                                                        <div className="w-0.5 h-full bg-gray-300 dark:bg-slate-700 mt-2" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-semibold">Step Completed: {completion.workflowStep?.label}</h4>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(completion.completedAt).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {completion.completedBy && (
                                                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            By: {completion.completedBy}
                                                        </p>
                                                    )}
                                                    {completion.fieldData && Object.keys(completion.fieldData).length > 0 && (
                                                        <div className="mt-2 p-2 bg-gray-50 dark:bg-slate-900 rounded text-xs">
                                                            <strong>Data Submitted:</strong>
                                                            <ul className="mt-1 space-y-1">
                                                                {Object.entries(completion.fieldData).map(([key, value]) => (
                                                                    <li key={key}>
                                                                        <span className="font-medium">{key}:</span> {String(value)}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {completion.documents && completion.documents.length > 0 && (
                                                        <div className="mt-2 text-xs">
                                                            <strong>Documents:</strong> {completion.documents.length} file(s) uploaded
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Completion Event */}
                                    {engagement.statut === 'REGLE' && (
                                        <div className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-green-600">Workflow Completed</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    All steps completed successfully
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            {selectedStep && (
                <>
                    <StepCompletionDialog
                        open={completionDialogOpen}
                        onOpenChange={setCompletionDialogOpen}
                        step={selectedStep}
                        onComplete={handleCompleteStep}
                    />
                    <StepDetailsDialog
                        open={detailsDialogOpen}
                        onOpenChange={setDetailsDialogOpen}
                        step={selectedStep}
                        stepData={{}}
                        isCompleted={selectedStep.isCompleted || false}
                        isCurrent={selectedStep.isCurrent || false}
                    />
                </>
            )}
        </div>
    );
}
