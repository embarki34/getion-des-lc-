'use client';

import { useState, useEffect } from 'react';
import { WorkflowTemplateService, WorkflowTemplate } from '@/lib/services/workflow/WorkflowTemplateService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    PlusCircle,
    FileText,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Workflows/Templates Overview Page
 * Shows all available workflow templates and quick stats
 */
export default function WorkflowsPage() {
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
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            </div>
        );
    }

    const activeTemplates = templates.filter(t => t.isActive);
    const totalSteps = templates.reduce((sum, t) => sum + (t.steps?.length || 0), 0);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Workflow Templates</h1>
                    <p className="text-gray-600 mt-1">
                        Manage financial instrument workflows
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/engagements/new">
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Engagement
                        </Button>
                    </Link>
                    <Link href="/templates">
                        <Button variant="outline">
                            Manage Templates
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Templates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{templates.length}</div>
                        <p className="text-sm text-gray-500 mt-1">
                            {activeTemplates.length} active
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Total Workflow Steps</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{totalSteps}</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Across all templates
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Active Engagements</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Currently in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Pending Approvals</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">0</div>
                        <p className="text-sm text-gray-500 mt-1">
                            Awaiting action
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Templates List */}
            <Card>
                <CardHeader>
                    <CardTitle>Available Instruments</CardTitle>
                    <CardDescription>
                        Click on a template to create a new engagement
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeTemplates.map((template) => (
                            <Link key={template.id} href="/engagements/new">
                                <Card className="cursor-pointer hover:shadow-lg transition-all hover:border-blue-500">
                                    <CardHeader>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                                                style={{ backgroundColor: template.color || '#3B82F6' }}
                                            >
                                                {template.code}
                                            </div>
                                            <div>
                                                <CardTitle className="text-base">{template.label}</CardTitle>
                                                <CardDescription className="text-xs">
                                                    {template.steps?.length || 0} steps
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {template.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
