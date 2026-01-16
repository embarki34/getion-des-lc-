'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { WorkflowStep, StepFieldConfig } from '@/lib/services/workflow/WorkflowTemplateService';
import { StepFieldConfigurator } from './StepFieldConfigurator';

interface StepEditorDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (stepData: Partial<WorkflowStep>) => Promise<void>;
    step?: WorkflowStep | null; // If provided, we are editing
    stepOrder: number; // Suggested order for new steps
}

export function StepEditorDialog({
    open,
    onOpenChange,
    onSubmit,
    step,
    stepOrder,
}: StepEditorDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [label, setLabel] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#3B82F6');
    const [requiresApproval, setRequiresApproval] = useState(false);

    // Field configurations
    const [requiredFields, setRequiredFields] = useState<StepFieldConfig[]>([]);

    const [requiredDocuments, setRequiredDocuments] = useState<string[]>([]);
    const [newDocument, setNewDocument] = useState('');

    useEffect(() => {
        if (open) {
            if (step) {
                // Edit Mode
                setLabel(step.label);
                setDescription(step.description || '');
                setColor(step.color || '#3B82F6');
                setRequiresApproval(step.requiresApproval);
                setRequiredFields(
                    Array.isArray(step.requiredFields) && step.requiredFields.length > 0 && typeof step.requiredFields[0] === 'string'
                        ? (step.requiredFields as string[]).map(name => ({ name, label: name, type: 'text' as const, required: true }))
                        : (step.requiredFields as StepFieldConfig[] || [])
                );
                setRequiredDocuments(step.requiredDocuments || []);
            } else {
                // Create Mode - Reset
                setLabel('');
                setDescription('');
                setColor('#3B82F6');
                setRequiresApproval(false);
                setRequiredFields([]);
                setRequiredDocuments([]);
            }
        }
    }, [open, step]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setIsSubmitting(true);
            await onSubmit({
                label,
                description,
                color,
                requiresApproval,
                requiredFields,
                requiredDocuments,
                stepOrder: step ? step.stepOrder : stepOrder, // Preserve order on edit, use new on create
                code: step ? step.code : label.toUpperCase().replace(/\s+/g, '_').slice(0, 20) // Simple code gen
            });
            onOpenChange(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const addDocument = () => {
        if (newDocument && !requiredDocuments.includes(newDocument)) {
            setRequiredDocuments([...requiredDocuments, newDocument]);
            setNewDocument('');
        }
    };

    const removeDocument = (doc: string) => {
        setRequiredDocuments(requiredDocuments.filter(d => d !== doc));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{step ? 'Edit Step' : 'Add New Step'}</DialogTitle>
                    <DialogDescription>
                        Configure the workflow step details and requirements.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="label">Step Label *</Label>
                            <Input
                                id="label"
                                value={label}
                                onChange={(e) => setLabel(e.target.value)}
                                placeholder="e.g. Manager Approval"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-12 h-10 p-1"
                                />
                                <Input
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What happens at this step?"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="approval"
                            checked={requiresApproval}
                            onCheckedChange={(c) => setRequiresApproval(!!c)}
                        />
                        <Label htmlFor="approval">Requires Approval</Label>
                    </div>

                    <div className="space-y-3">
                        <StepFieldConfigurator
                            fields={requiredFields}
                            onChange={setRequiredFields}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label>Required Documents</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newDocument}
                                onChange={(e) => setNewDocument(e.target.value)}
                                placeholder="e.g. Invoice"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDocument())}
                            />
                            <Button type="button" onClick={addDocument} size="sm" variant="secondary">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 min-h-[2rem]">
                            {requiredDocuments.map(doc => (
                                <Badge key={doc} variant="outline" className="pl-2 pr-1 py-1 flex items-center gap-1">
                                    {doc}
                                    <button onClick={() => removeDocument(doc)} type="button" className="hover:text-red-500">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {requiredDocuments.length === 0 && (
                                <span className="text-sm text-gray-400 italic">No required documents</span>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {step ? 'Save Changes' : 'Create Step'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
