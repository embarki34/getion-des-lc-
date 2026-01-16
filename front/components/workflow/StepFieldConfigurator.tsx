'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { StepFieldConfig } from '@/lib/services/workflow/WorkflowTemplateService';

interface StepFieldConfiguratorProps {
    fields: StepFieldConfig[];
    onChange: (fields: StepFieldConfig[]) => void;
}

export function StepFieldConfigurator({ fields, onChange }: StepFieldConfiguratorProps) {
    const addField = () => {
        const newField: StepFieldConfig = {
            name: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text',
            required: false,
        };
        onChange([...fields, newField]);
    };

    const updateField = (index: number, updates: Partial<StepFieldConfig>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        onChange(newFields);
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        onChange(newFields);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label className="text-sm font-medium">Field Configuration</Label>
                <Button type="button" onClick={addField} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                </Button>
            </div>

            {fields.length === 0 && (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p className="text-sm">No fields configured. Click "Add Field" to start.</p>
                </div>
            )}

            <div className="space-y-3">
                {fields.map((field, index) => (
                    <Card key={index} className="relative group">
                        <CardContent className="p-4 flex gap-4">
                            <div className="mt-3 text-gray-400 cursor-move">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                                {/* Label */}
                                <div className="space-y-1">
                                    <Label className="text-xs">Label</Label>
                                    <Input
                                        value={field.label}
                                        onChange={(e) => updateField(index, {
                                            label: e.target.value,
                                            name: field.name.startsWith('field_')
                                                ? e.target.value.toLowerCase().replace(/\s+/g, '_')
                                                : field.name
                                        })}
                                        placeholder="Field Label"
                                        className="h-9"
                                    />
                                </div>

                                {/* Name */}
                                <div className="space-y-1">
                                    <Label className="text-xs">Name</Label>
                                    <Input
                                        value={field.name}
                                        onChange={(e) => updateField(index, { name: e.target.value })}
                                        placeholder="field_name"
                                        className="h-9 font-mono text-xs"
                                    />
                                </div>

                                {/* Type */}
                                <div className="space-y-1">
                                    <Label className="text-xs">Type</Label>
                                    <Select
                                        value={field.type}
                                        onValueChange={(value: any) => updateField(index, { type: value, readonly: value === 'calculated' })}
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="textarea">Textarea</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="relation">Relation</SelectItem>
                                            <SelectItem value="checkbox">Checkbox</SelectItem>
                                            <SelectItem value="calculated">Calculated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Required Checkbox */}
                                <div className="space-y-1 flex items-end">
                                    <div className="flex items-center space-x-2 h-9">
                                        <Checkbox
                                            id={`required-${index}`}
                                            checked={field.required || false}
                                            onCheckedChange={(checked) => updateField(index, { required: !!checked })}
                                        />
                                        <Label htmlFor={`required-${index}`} className="text-xs cursor-pointer">
                                            Required
                                        </Label>
                                    </div>
                                </div>

                                {/* Relation Config */}
                                {field.type === 'relation' && (
                                    <div className="col-span-full space-y-1">
                                        <Label className="text-xs">Relation To</Label>
                                        <Select
                                            value={field.relationTo || ''}
                                            onValueChange={(value: any) => updateField(index, { relationTo: value })}
                                        >
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select relation type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="banks">Banks</SelectItem>
                                                <SelectItem value="companies">Companies</SelectItem>
                                                <SelectItem value="suppliers">Suppliers</SelectItem>
                                                <SelectItem value="clients">Clients</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                {/* Select Options */}
                                {field.type === 'select' && (
                                    <div className="col-span-full space-y-1">
                                        <Label className="text-xs">Options (comma-separated)</Label>
                                        <Input
                                            value={field.options?.join(', ') || ''}
                                            onChange={(e) => updateField(index, {
                                                options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                                            })}
                                            placeholder="Option 1, Option 2, Option 3"
                                            className="h-9"
                                        />
                                    </div>
                                )}

                                {/* Calculated Field Configuration */}
                                {field.type === 'calculated' && (
                                    <div className="col-span-full space-y-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Formula (JavaScript expression)</Label>
                                            <Input
                                                value={field.formula || ''}
                                                onChange={(e) => updateField(index, { formula: e.target.value })}
                                                placeholder="e.g., capital * rate"
                                                className="h-9 font-mono text-xs"
                                            />
                                            <p className="text-xs text-muted-foreground">Use field names as variables. Example: capital * 0.05</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Depends On (comma-separated field names)</Label>
                                            <Input
                                                value={field.calculatedFrom?.join(', ') || ''}
                                                onChange={(e) => updateField(index, {
                                                    calculatedFrom: e.target.value.split(',').map(f => f.trim()).filter(Boolean)
                                                })}
                                                placeholder="capital, rate, periods"
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Placeholder */}
                                <div className="col-span-full space-y-1">
                                    <Label className="text-xs">Placeholder (optional)</Label>
                                    <Input
                                        value={field.placeholder || ''}
                                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                                        placeholder="Enter placeholder text..."
                                        className="h-9"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeField(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
