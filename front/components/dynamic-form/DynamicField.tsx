'use client';

import { useState, useEffect } from 'react';
import { FormFieldSchema } from '@/lib/services/workflow/WorkflowTemplateService';
import { RelationService, SelectOption } from '@/lib/services/RelationService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';

interface DynamicFieldProps {
    field: FormFieldSchema;
    value: any;
    onChange: (value: any) => void;
    error?: string;
}

/**
 * Dynamic Field Component
 * Renders a form field based on its type from JSON schema
 */
export function DynamicField({ field, value, onChange, error }: DynamicFieldProps) {
    const [relationOptions, setRelationOptions] = useState<SelectOption[]>([]);
    const [loadingRelation, setLoadingRelation] = useState(false);

    // Fetch relation options if field type is 'relation'
    useEffect(() => {
        if (field.type === 'relation' && field.relationTo) {
            loadRelationOptions();
        }
    }, [field.type, field.relationTo]);

    const loadRelationOptions = async () => {
        if (!field.relationTo) return;

        try {
            setLoadingRelation(true);
            const options = await RelationService.fetchOptions(field.relationTo);
            setRelationOptions(options);
        } catch (error) {
            console.error(`Error loading ${field.relationTo} options:`, error);
        } finally {
            setLoadingRelation(false);
        }
    };

    const renderField = () => {
        switch (field.type) {
            case 'text':
                return (
                    <Input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.label}
                        required={field.required}
                    />
                );

            case 'number':
                return (
                    <Input
                        type="number"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                        placeholder={field.label}
                        required={field.required}
                        min={field.min}
                        max={field.max}
                        step={field.step || 1}
                    />
                );

            case 'date':
                return (
                    <Input
                        type="date"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={field.required}
                    />
                );

            case 'select':
                return (
                    <Select value={value || field.defaultValue || ''} onValueChange={onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'textarea':
                return (
                    <Textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.label}
                        required={field.required}
                        rows={4}
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={value || field.defaultValue || false}
                            onCheckedChange={onChange}
                        />
                        <Label>{value ? 'Yes' : 'No'}</Label>
                    </div>
                );

            case 'relation':
                // Relational field - fetch options from backend
                if (loadingRelation) {
                    return (
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-900">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Loading {field.relationTo}...
                            </span>
                        </div>
                    );
                }

                if (relationOptions.length === 0) {
                    return (
                        <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200">
                            <span className="text-sm">
                                No {field.relationTo} available
                            </span>
                        </div>
                    );
                }

                return (
                    <Select value={value || ''} onValueChange={onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {relationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'file':
                return (
                    <Input
                        type="file"
                        onChange={(e) => onChange(e.target.files?.[0] || null)}
                        required={field.required}
                    />
                );

            default:
                return (
                    <Input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.label}
                    />
                );
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {renderField()}
            {field.helpText && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{field.helpText}</p>
            )}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
