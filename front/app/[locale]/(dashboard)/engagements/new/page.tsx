'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { WorkflowTemplateService, WorkflowTemplate } from '@/lib/services/workflow/WorkflowTemplateService';
import { EngagementsService } from '@/lib/services/engagements.service';
import { DynamicForm } from '@/components/dynamic-form/DynamicForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

/**
 * New Engagement Page
 * Step 1: Select instrument type (template)
 * Step 2: Fill dynamic form based on template
 * Step 3: Confirmation
 */
export default function NewEngagementPage() {
    const router = useRouter();
    const [step, setStep] = useState<'select' | 'form' | 'confirmation'>('select');
    const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
    const [selectedTemplate, setSelectedTemplate] = useState<WorkflowTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const searchParams = useSearchParams();
    const templateIdParam = searchParams.get('templateId');

    useEffect(() => {
        loadTemplates();
    }, []);

    useEffect(() => {
        if (templates.length > 0 && templateIdParam && step === 'select') {
            const preselected = templates.find(t => t.id === templateIdParam);
            if (preselected) {
                handleTemplateSelect(preselected);
            }
        }
    }, [templates, templateIdParam, step]);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const data = await WorkflowTemplateService.getAllTemplates();
            setTemplates(data.filter(t => t.isActive).sort((a, b) => a.displayOrder - b.displayOrder));
        } catch (err: any) {
            console.error('Failed to load templates:', err);
            setError(err.message || 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    const handleTemplateSelect = (template: WorkflowTemplate) => {
        setSelectedTemplate(template);
        setStep('form');
    };

    const handleSubmit = async (formData: Record<string, any>) => {
        try {
            setSubmitting(true);

            if (!selectedTemplate) {
                throw new Error('No template selected');
            }

            // DEBUG: Log what we received
            console.log('Form Data Received:', formData);
            console.log('Form Data Keys:', Object.keys(formData));

            // Extract fields from formData - use flexible field names
            // First try standard field names, then check all keys for matches
            let ligneCreditId = formData.ligneCreditId || formData.creditLineId || formData.ligneCredit;

            // If not found, search for any field containing "credit" or "ligne"
            if (!ligneCreditId) {
                const creditField = Object.keys(formData).find(key =>
                    key.toLowerCase().includes('credit') ||
                    key.toLowerCase().includes('ligne')
                );
                if (creditField) {
                    ligneCreditId = formData[creditField];
                    console.log(`Found credit line in field: ${creditField} = ${ligneCreditId}`);
                }
            }

            const montant = formData.montant ? Number(formData.montant) : (formData.amount ? Number(formData.amount) : undefined);
            const devise = formData.devise || formData.currency || 'USD';
            const dateEngagement = formData.dateEngagement || formData.startDate || new Date().toISOString().split('T')[0];
            const dateEcheance = formData.dateEcheance || formData.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            // Validation removed as per user request - data is driven by template schema
            // if (!ligneCreditId) { ... }
            // if (!montant || isNaN(montant)) { ... }

            console.log('Extracted values (optional):', { ligneCreditId, montant, devise, dateEngagement, dateEcheance });

            // Create engagement via API
            const engagement = await EngagementsService.createEngagement({
                ligneCreditId,
                workflowTemplateId: selectedTemplate.id,
                montant,
                devise,
                dateEngagement,
                dateEcheance,
                formData, // Pass all form data as additional metadata
            });

            console.log('Engagement created successfully:', engagement);
            setStep('confirmation');
        } catch (err: any) {
            console.error('Failed to create engagement:', err);
            alert('Failed to create engagement: ' + (err.message || 'Unknown error'));
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        if (step === 'form') {
            setStep('select');
            setSelectedTemplate(null);
        } else {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Step 1: Select Template
    if (step === 'select') {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/engagements">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Engagements
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">New Engagement</h1>
                        <p className="text-gray-600">Select the type of financial instrument</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <Card
                            key={template.id}
                            className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500"
                            onClick={() => handleTemplateSelect(template)}
                        >
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                                        style={{ backgroundColor: template.color || '#3B82F6' }}
                                    >
                                        {template.code}
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle>{template.label}</CardTitle>
                                        <CardDescription className="text-xs mt-1">
                                            {template.code}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {template.description || 'No description'}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500">{template.steps?.length || 0} steps</span>
                                    <Badge variant="outline">
                                        {template.formSchema?.fields?.length || 0} fields
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {templates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No active templates available</p>
                    </div>
                )}
            </div>
        );
    }

    // Step 2: Fill Form
    if (step === 'form' && selectedTemplate) {
        return (
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div className="flex items-center gap-3">
                        <div
                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: selectedTemplate.color || '#3B82F6' }}
                        >
                            {selectedTemplate.code}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">New {selectedTemplate.label}</h1>
                            <p className="text-gray-600">Fill in the required information</p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Engagement Information</CardTitle>
                        <CardDescription>
                            Complete all required fields marked with *
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedTemplate.formSchema ? (
                            <DynamicForm
                                schema={selectedTemplate.formSchema}
                                onSubmit={handleSubmit}
                                onCancel={handleBack}
                                submitLabel="Create Engagement"
                                isSubmitting={submitting}
                            />
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No form schema defined for this template
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Step 3: Confirmation
    if (step === 'confirmation' && selectedTemplate) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <Card className="text-center">
                    <CardContent className="pt-12 pb-12 space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-12 w-12 text-green-600" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Engagement Created Successfully!</h2>
                            <p className="text-gray-600">
                                Your {selectedTemplate.label} engagement has been created and is now in the first workflow step.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center pt-4">
                            <Link href="/engagements">
                                <Button>View All Engagements</Button>
                            </Link>
                            <Button variant="outline" onClick={() => {
                                setStep('select');
                                setSelectedTemplate(null);
                            }}>
                                Create Another
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return null;
}
