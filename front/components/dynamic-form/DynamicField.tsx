'use client';

import { FormFieldSchema } from '@/lib/services/workflow/WorkflowTemplateService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

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
                // For now, simple text input for relation ID
                // TODO: Add autocomplete/search for related entities
                return (
                    <Input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={`Select ${field.label}`}
                        required={field.required}
                    />
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
                <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
