'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkflowTemplateService, FormSchema } from '@/lib/services/workflow/WorkflowTemplateService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NewTemplatePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        label: '',
        code: '',
        description: '',
        icon: '',
        color: '#3B82F6',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.label || !formData.code) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsSubmitting(true);

            // Initial empty schema
            const defaultSchema: FormSchema = {
                fields: []
            };

            const newTemplate = await WorkflowTemplateService.createTemplate({
                ...formData,
                formSchema: defaultSchema
            });

            toast.success('Template created successfully');

            // Redirect to the edit/details page for further configuration
            router.push(`/templates/${newTemplate.id}`);
        } catch (error: any) {
            console.error('Failed to create template:', error);
            toast.error('Failed to create template: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/templates">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Templates
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Create New Template</h1>
                    <p className="text-gray-600">Define a new financial instrument workflow</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                        Start by defining the core details of your template. You can add steps and form fields later.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="label">Template Name *</Label>
                            <Input
                                id="label"
                                name="label"
                                placeholder="e.g. Letter of Credit"
                                value={formData.label}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="code">Code *</Label>
                            <Input
                                id="code"
                                name="code"
                                placeholder="e.g. LC"
                                value={formData.code}
                                onChange={handleChange}
                                required
                                maxLength={10}
                            />
                            <p className="text-xs text-gray-500">Unique identifier code (max 10 chars)</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Brief description of when to use this instrument..."
                                value={formData.description}
                                onChange={handleChange}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="color">Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="color"
                                        name="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        className="w-12 h-10 p-1"
                                    />
                                    <Input
                                        value={formData.color}
                                        onChange={handleChange}
                                        name="color"
                                        placeholder="#3B82F6"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="icon">Icon Name</Label>
                                <Input
                                    id="icon"
                                    name="icon"
                                    placeholder="e.g. FileText"
                                    value={formData.icon}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Template
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
