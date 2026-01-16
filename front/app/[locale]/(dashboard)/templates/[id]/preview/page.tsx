'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkflowTemplateService, WorkflowTemplate } from '@/lib/services/workflow/WorkflowTemplateService';
import { DynamicForm } from '@/components/dynamic-form/DynamicForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Template Preview Page
 * Shows how the dynamic form looks for a template
 */
export default function TemplatePreviewPage() {
    const params = useParams();
    const router = useRouter();
    const [template, setTemplate] = useState<WorkflowTemplate | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTemplate();
    }, [params.id]);

    const loadTemplate = async () => {
        try {
            setLoading(true);
            const data = await WorkflowTemplateService.getTemplateById(params.id as string);
            setTemplate(data);
        } catch (err: any) {
            console.error('Failed to load template:', err);
            setError(err.message || 'Failed to load template');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: Record<string, any>) => {
        console.log('Form submitted:', data);
        alert('This is a preview. Form submitted successfully!\n\n' + JSON.stringify(data, null, 2));
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
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    {error || 'Template not found'}
                </div>
            </div>
        );
    }

    if (!template.formSchema) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 text-yellow-600 p-4 rounded-md">
                    This template doesn't have a form schema defined yet.
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/templates">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: template.color || '#3B82F6' }}
                    >
                        {template.code}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{template.label} - Form Preview</h1>
                        <p className="text-gray-600">{template.description}</p>
                    </div>
                </div>
            </div>

            {/* Form Preview */}
            <Card>
                <CardHeader>
                    <CardTitle>Form Preview</CardTitle>
                    <p className="text-sm text-gray-600">
                        This is how the form will appear when creating a new {template.label}
                    </p>
                </CardHeader>
                <CardContent>
                    <DynamicForm
                        schema={template.formSchema}
                        onSubmit={handleSubmit}
                        onCancel={() => router.back()}
                        submitLabel="Test Submit"
                    />
                </CardContent>
            </Card>
        </div>
    );
}
