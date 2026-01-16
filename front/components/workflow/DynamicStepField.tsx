'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StepFieldConfig } from '@/lib/services/workflow/WorkflowTemplateService';
import { RelationService, SelectOption } from '@/lib/services/RelationService';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import { evaluateFormula } from '@/lib/utils/formulaEvaluator';

interface DynamicStepFieldProps {
    field: StepFieldConfig;
    value: any;
    onChange: (value: any) => void;
    allFieldValues?: Record<string, any>; // For formula evaluation
}

export function DynamicStepField({ field, value, onChange, allFieldValues = {} }: DynamicStepFieldProps) {
    const [relationOptions, setRelationOptions] = useState<SelectOption[]>([]);
    const [loadingRelations, setLoadingRelations] = useState(false);

    // Load relation data if field is relation type
    useEffect(() => {
        if (field.type === 'relation' && field.relationTo) {
            loadRelationData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.type, field.relationTo]);

    const loadRelationData = async () => {
        if (!field.relationTo) return;

        setLoadingRelations(true);
        try {
            const data = await RelationService.fetchOptions(field.relationTo);
            setRelationOptions(data); // Just replace, don't append
        } catch (error) {
            console.error('Failed to load relation data:', error);
        } finally {
            setLoadingRelations(false);
        }
    };

    // Calculate value for calculated fields
    useEffect(() => {
        if (field.type === 'calculated' && field.formula && field.calculatedFrom) {
            const result = evaluateFormula(field.formula, allFieldValues);
            if (result !== null && result !== value) {
                onChange(result);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [field.type, field.formula, allFieldValues, ...Object.values(allFieldValues)]);

    // Render appropriate input based on field type
    switch (field.type) {
        case 'textarea':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea
                        id={field.name}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                </div>
            );

        case 'number':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                        id={field.name}
                        type="number"
                        value={value || ''}
                        onChange={(e) => onChange(parseFloat(e.target.value))}
                        placeholder={field.placeholder}
                        required={field.required}
                        min={field.validation?.min}
                        max={field.validation?.max}
                    />
                </div>
            );

        case 'date':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {value ? format(new Date(value), 'PPP') : field.placeholder || 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={value ? new Date(value) : undefined}
                                onSelect={(date) => onChange(date?.toISOString())}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            );

        case 'select':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Select value={value || ''} onValueChange={onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'relation':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Select
                        value={value || ''}
                        onValueChange={onChange}
                        disabled={loadingRelations}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                loadingRelations
                                    ? 'Loading...'
                                    : field.placeholder || `Select ${field.label}`
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {relationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );

        case 'checkbox':
            return (
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id={field.name}
                        checked={!!value}
                        onCheckedChange={(checked) => onChange(!!checked)}
                    />
                    <Label htmlFor={field.name} className="cursor-pointer">
                        {field.label}
                    </Label>
                </div>
            );

        case 'calculated':
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        <Calculator className="inline-block ml-2 h-3 w-3 text-blue-500" />
                    </Label>
                    <div className="relative">
                        <Input
                            id={field.name}
                            type="text"
                            value={value !== null && value !== undefined ? value.toLocaleString() : ''}
                            readOnly
                            className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 font-mono"
                        />
                        {field.formula && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Formula: <code className="bg-muted px-1 py-0.5 rounded">{field.formula}</code>
                            </p>
                        )}
                    </div>
                </div>
            );

        case 'text':
        default:
            return (
                <div className="space-y-2">
                    <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <Input
                        id={field.name}
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                    />
                </div>
            );
    }
}
