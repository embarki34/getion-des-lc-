'use client';

import { useState, useEffect } from 'react';
import { FormSchema } from '@/lib/services/workflow/WorkflowTemplateService';
import { DynamicField } from './DynamicField';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DynamicFormProps {
    schema: FormSchema;
    initialValues?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void | Promise<void>;
    onCancel?: () => void;
    submitLabel?: string;
    isSubmitting?: boolean;
}

/**
 * Dynamic Form Component
 * Renders a complete form based on JSON schema
 */
export function DynamicForm({
    schema,
    initialValues = {},
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    isSubmitting = false,
}: DynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(initialValues);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        // Initialize with default values
        const defaults: Record<string, any> = {};
        schema.fields.forEach((field) => {
            if (field.defaultValue !== undefined && formData[field.name] === undefined) {
                defaults[field.name] = field.defaultValue;
            }
        });
        if (Object.keys(defaults).length > 0) {
            setFormData((prev) => ({ ...defaults, ...prev }));
        }
    }, [schema]);

    const handleFieldChange = (fieldName: string, value: any) => {
        setFormData((prev) => ({ ...prev, [fieldName]: value }));
        // Clear error for this field
        if (errors[fieldName]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        schema.fields.forEach((field) => {
            if (field.required) {
                const value = formData[field.name];
                if (value === undefined || value === null || value === '') {
                    newErrors[field.name] = `${field.label} is required`;
                }
            }

            // Type-specific validation
            if (formData[field.name] !== undefined && formData[field.name] !== null) {
                const value = formData[field.name];

                if (field.type === 'number') {
                    const num = Number(value);
                    if (field.min !== undefined && num < field.min) {
                        newErrors[field.name] = `Minimum value is ${field.min}`;
                    }
                    if (field.max !== undefined && num > field.max) {
                        newErrors[field.name] = `Maximum value is ${field.max}`;
                    }
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schema.fields.map((field) => (
                    <div
                        key={field.name}
                        className={field.type === 'textarea' ? 'md:col-span-2' : ''}
                    >
                        <DynamicField
                            field={field}
                            value={formData[field.name]}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            error={errors[field.name]}
                        />
                    </div>
                ))}
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t">
                {onCancel && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
