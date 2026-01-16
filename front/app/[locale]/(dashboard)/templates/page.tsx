'use client';

import { useState, useEffect } from 'react';
import { WorkflowTemplateService, WorkflowTemplate } from '@/lib/services/workflow/WorkflowTemplateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Settings, Eye } from 'lucide-react';
import Link from 'next/link';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTemplates();
    }, []);

    const loadTemplates = async () => {
        try {
            setLoading(true);
            const data = await WorkflowTemplateService.getAllTemplates();
            setTemplates(data.sort((a, b) => a.displayOrder - b.displayOrder));
        } catch (err: any) {
            console.error('Failed to load templates:', err);
            setError(err.message || 'Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading templates...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Instrument Templates</h1>
                    <p className="text-gray-600 mt-1">
                        Manage workflow templates for financial instruments (LC, AS, AF, RD, CMT)
                    </p>
                </div>
                <Link href="/templates/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Template
                    </Button>
                </Link>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                        style={{ backgroundColor: template.color || '#3B82F6' }}
                                    >
                                        {template.code}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{template.label}</CardTitle>
                                        <CardDescription className="text-xs">{template.code}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={template.isActive ? 'default' : 'secondary'}>
                                    {template.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {template.description || 'No description'}
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-500">Steps</p>
                                    <p className="font-semibold">{template.steps?.length || 0}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Fields</p>
                                    <p className="font-semibold">{template.formSchema?.fields?.length || 0}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                                <Link href={`/templates/${template.id}`} className="flex-1">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Settings className="mr-2 h-3 w-3" />
                                        Details
                                    </Button>
                                </Link>
                                <Link href={`/templates/${template.id}/preview`} className="flex-1">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <Eye className="mr-2 h-3 w-3" />
                                        Preview
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {templates.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 mb-4">No templates found</p>
                    <Link href="/templates/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Your First Template
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
