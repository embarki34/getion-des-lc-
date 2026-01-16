'use client';

import { useState, useEffect, use } from 'react';
import { WorkflowTemplateService, WorkflowTemplate, WorkflowStep, FormSchema } from '@/lib/services/workflow/WorkflowTemplateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, Play, Settings, FileText, CheckCircle2, AlertCircle, Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { StepEditorDialog } from '@/components/workflow/StepEditorDialog';
import { SchemaEditor } from '@/components/workflow/SchemaEditor';

export default function TemplateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [template, setTemplate] = useState<WorkflowTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Editor State
    const [isStepDialogOpen, setIsStepDialogOpen] = useState(false);
    const [editingStep, setEditingStep] = useState<WorkflowStep | null>(null);

    useEffect(() => {
        loadTemplate();
    }, [id]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const data = await WorkflowTemplateService.getTemplateById(id);
            // Ensure steps are sorted
            if (data.steps) {
                data.steps.sort((a, b) => a.stepOrder - b.stepOrder);
            }
            setTemplate(data);
        } catch (err: any) {
            console.error('Failed to load template:', err);
            setError(err.message || 'Failed to load template');
        } finally {
            setLoading(false);
        }
    };

    // --- STEP ACTIONS ---

    const handleAddStep = () => {
        setEditingStep(null);
        setIsStepDialogOpen(true);
    };

    const handleEditStep = (step: WorkflowStep) => {
        setEditingStep(step);
        setIsStepDialogOpen(true);
    };

    const handleDeleteStep = async (stepId: string) => {
        if (!confirm('Are you sure you want to delete this step?')) return;
        try {
            await WorkflowTemplateService.deleteStep(stepId);
            toast.success('Step deleted');
            loadTemplate();
        } catch (error) {
            toast.error('Failed to delete step');
        }
    };

    const handleStepSubmit = async (stepData: Partial<WorkflowStep>) => {
        try {
            if (editingStep) {
                await WorkflowTemplateService.updateStep(editingStep.id, stepData);
                toast.success('Step updated');
            } else {
                await WorkflowTemplateService.addStep(id, {
                    code: stepData.code || 'NEW_STEP',
                    label: stepData.label || 'New Step',
                    stepOrder: stepData.stepOrder || (template?.steps.length || 0) + 1,
                    description: stepData.description || undefined,
                    requiredFields: stepData.requiredFields as any, // Support both formats
                    requiredDocuments: stepData.requiredDocuments || undefined,
                    requiresApproval: stepData.requiresApproval || false,
                    approvalRoles: stepData.approvalRoles || undefined,
                    triggerAction: stepData.triggerAction || undefined,
                    icon: stepData.icon || undefined,
                    color: stepData.color || undefined,
                    allowedRoles: stepData.allowedRoles || undefined
                });
                toast.success('Step created');
            }
            loadTemplate();
        } catch (error) {
            toast.error('Failed to save step');
            throw error;
        }
    };

    // --- SCHEMA ACTIONS ---

    const handleSchemaChange = async (newSchema: FormSchema) => {
        try {
            // Optimistic update
            if (template) {
                setTemplate({ ...template, formSchema: newSchema });
            }

            await WorkflowTemplateService.updateTemplate(id, { formSchema: newSchema });
            // toast.success('Schema saved'); // Too noisy?
        } catch (error) {
            toast.error('Failed to save schema changes');
            loadTemplate(); // Revert
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !template) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    {error || 'Template not found'}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <StepEditorDialog
                open={isStepDialogOpen}
                onOpenChange={setIsStepDialogOpen}
                onSubmit={handleStepSubmit}
                step={editingStep}
                stepOrder={(template?.steps.length || 0) + 1}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/templates">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                            style={{ backgroundColor: template.color || '#3B82F6' }}
                        >
                            {template.code}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">{template.label}</h1>
                                <Badge variant={template.isActive ? 'default' : 'secondary'}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <p className="text-gray-600">{template.description}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/engagements/new?templateId=${template.id}`}>
                        <Button className="bg-green-600 hover:bg-green-700">
                            <Play className="mr-2 h-4 w-4" />
                            Create Instrument
                        </Button>
                    </Link>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="configuration">Configuration</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB - Details View */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Col: Workflow Steps */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Workflow Process</CardTitle>
                                    <CardDescription>
                                        Sequence of steps for this instrument
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l-2 border-gray-200 ml-4 space-y-8 pb-4">
                                        {template.steps?.map((step, index) => (
                                            <div key={step.id} className="ml-6 relative">
                                                {/* Dot */}
                                                <div
                                                    className="absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                                    style={{ backgroundColor: step.color || template.color || '#3B82F6' }}
                                                />

                                                <div className="flex items-start justify-between bg-white dark:bg-slate-950 p-4 rounded-lg border dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                Step {step.stepOrder}
                                                            </span>
                                                            {step.requiresApproval && (
                                                                <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                                                                    Approval Required
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h3 className="font-semibold text-lg dark:text-gray-200">{step.label}</h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>

                                                        <div className="mt-4 flex flex-wrap gap-4">
                                                            {/* Required Fields */}
                                                            {step.requiredFields && step.requiredFields.length > 0 && (
                                                                <div className="bg-blue-50 p-3 rounded text-sm">
                                                                    <span className="font-medium text-blue-700 block mb-1">Required Fields:</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {step.requiredFields.map((f: any, idx: number) => (
                                                                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                                {typeof f === 'string' ? f : (f.label || f.name)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Required Documents */}
                                                            {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                                                                <div className="bg-indigo-50 p-3 rounded text-sm">
                                                                    <span className="font-medium text-indigo-700 block mb-1">Required Documents:</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {step.requiredDocuments.map(d => (
                                                                            <span key={d} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                                                                                <FileText className="w-3 h-3 mr-1" />
                                                                                {d}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!template.steps || template.steps.length === 0) && (
                                            <div className="ml-6 text-gray-500 italic">
                                                No steps defined for this workflow yet.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Col: Metadata & Requirements */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Instrument Requirements</CardTitle>
                                    <CardDescription>Initial data required to open this instrument</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {template.formSchema?.fields.map(field => (
                                            <li key={field.name} className="flex items-center gap-2 text-sm border-b pb-2 last:border-0 last:pb-0">
                                                <CheckCircle2 className={`h-4 w-4 ${field.required ? 'text-green-500' : 'text-gray-300'}`} />
                                                <span className={field.required ? 'font-medium' : 'text-gray-600'}>
                                                    {field.label}
                                                </span>
                                                {field.required && <span className="text-xs text-red-500">*</span>}
                                            </li>
                                        ))}
                                        {(!template.formSchema?.fields || template.formSchema.fields.length === 0) && (
                                            <li className="text-gray-500 italic text-sm">No initial fields defined.</li>
                                        )}
                                    </ul>
                                    <div className="mt-6">
                                        <Link href={`/templates/${template.id}/preview`}>
                                            <Button variant="outline" className="w-full">
                                                Preview Form
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Permissions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm text-gray-600">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="h-4 w-4 text-blue-500" />
                                            <span>Visible to: <strong>All Users</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4 text-amber-500" />
                                            <span>Execution restricted by roles per step</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                {/* CONFIGURATION TAB */}
                <TabsContent value="configuration" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Steps Configuration */}
                        <Card className="h-full">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle>Workflow Steps</CardTitle>
                                    <CardDescription>Manage the sequence of steps</CardDescription>
                                </div>
                                <Button onClick={handleAddStep} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Step
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {template.steps?.map((step, index) => (
                                        <div key={step.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-950 border dark:border-slate-800 rounded-lg shadow-sm group hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {step.stepOrder}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm dark:text-gray-200">{step.label}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{step.description}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400" onClick={() => handleEditStep(step)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" onClick={() => handleDeleteStep(step.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!template.steps || template.steps.length === 0) && (
                                        <div className="text-center py-8 text-gray-500 italic">
                                            No steps defined. Add a step to get started.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Schema Configuration */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Instrument Form Schema</CardTitle>
                                <CardDescription>Define the fields required to start this workflow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SchemaEditor
                                    schema={template.formSchema}
                                    onChange={handleSchemaChange}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
