'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { FormFieldSchema, FormSchema } from '@/lib/services/workflow/WorkflowTemplateService';

interface SchemaEditorProps {
    schema: FormSchema | null;
    onChange: (schema: FormSchema) => void;
}

export function SchemaEditor({ schema, onChange }: SchemaEditorProps) {
    const fields = schema?.fields || [];

    const addField = () => {
        const newField: FormFieldSchema = {
            name: `field_${Date.now()}`,
            label: 'New Field',
            type: 'text',
            required: false,
        };
        onChange({ fields: [...fields, newField] });
    };

    const updateField = (index: number, updates: Partial<FormFieldSchema>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        onChange({ fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = fields.filter((_, i) => i !== index);
        onChange({ fields: newFields });
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {fields.map((field, index) => (
                    <Card key={index} className="relative group">
                        <CardContent className="p-4 flex gap-4 items-start">
                            <div className="mt-3 text-gray-400 cursor-move">
                                <GripVertical className="h-5 w-5" />
                            </div>

                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs">Label</Label>
                                    <Input
                                        value={field.label}
                                        onChange={(e) => updateField(index, {
                                            label: e.target.value,
                                            // Auto-generate name from label if name is default/empty
                                            name: field.name.startsWith('field_')
                                                ? e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '_')
                                                : field.name
                                        })}
                                        placeholder="Field Label"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Variable Name</Label>
                                    <Input
                                        value={field.name}
                                        onChange={(e) => updateField(index, { name: e.target.value })}
                                        placeholder="variable_name"
                                        className={`font-mono text-xs ${field.type === 'relation' ? 'bg-gray-100 dark:bg-slate-900 cursor-not-allowed' : ''}`}
                                        disabled={field.type === 'relation'}
                                    />
                                    {field.type === 'relation' && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            ✓ Auto-generated from relation type
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs">Type</Label>
                                    <Select
                                        value={field.type}
                                        onValueChange={(v: any) => updateField(index, { type: v })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="textarea">Long Text</SelectItem>
                                            <SelectItem value="select">Select</SelectItem>
                                            <SelectItem value="boolean">Checkbox</SelectItem>
                                            <SelectItem value="relation">Relation</SelectItem>
                                            <SelectItem value="file">File Upload</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {field.type === 'relation' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs">Relation To</Label>
                                        <Select
                                            value={field.relationTo || ''}
                                            onValueChange={(v: string) => {
                                                // Auto-set field name based on relation type
                                                const nameMap: Record<string, string> = {
                                                    'banks': 'banqueId',
                                                    'companies': 'companyId',
                                                    'suppliers': 'supplierId',
                                                    'creditLines': 'ligneCreditId',
                                                };
                                                updateField(index, {
                                                    relationTo: v,
                                                    name: nameMap[v] || v + 'Id'
                                                });
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select entity" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="banks">Banks</SelectItem>
                                                <SelectItem value="companies">Companies</SelectItem>
                                                <SelectItem value="suppliers">Suppliers</SelectItem>
                                                <SelectItem value="creditLines">Credit Lines</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={field.required}
                                            onCheckedChange={(c) => updateField(index, { required: !!c })}
                                            id={`req-${index}`}
                                        />
                                        <Label htmlFor={`req-${index}`}>Required</Label>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-red-500"
                                        onClick={() => removeField(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {fields.length === 0 && (
                    <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 bg-gray-50">
                        No fields defined. Add fields to define the input form.
                    </div>
                )}
            </div>

            <Button onClick={addField} variant="outline" className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                Add Field
            </Button>
        </div>
    );
}
