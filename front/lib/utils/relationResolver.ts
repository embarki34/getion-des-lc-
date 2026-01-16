import { RelationService } from '@/lib/services/RelationService';
import { StepFieldConfig } from '@/lib/services/workflow/WorkflowTemplateService';

/**
 * Resolve relation IDs to their display names
 */
export async function resolveRelationValue(
    fieldConfig: StepFieldConfig,
    value: any
): Promise<string> {
    if (!value) return '';

    // If not a relation field, return value as-is
    if (fieldConfig.type !== 'relation' || !fieldConfig.relationTo) {
        return String(value);
    }

    try {
        // Fetch options for this relation type
        const options = await RelationService.fetchOptions(fieldConfig.relationTo);

        // Find matching option
        const match = options.find(opt => opt.value === value);

        if (match) {
            // Return label with ID for reference
            return `${match.label} (${value})`;
        }

        // Fallback to just ID if not found
        return `ID: ${value}`;
    } catch (error) {
        console.error('Failed to resolve relation:', error);
        return `ID: ${value}`;
    }
}

/**
 * Resolve multiple field values at once
 */
export async function resolveFieldData(
    fields: StepFieldConfig[],
    fieldData: Record<string, any>
): Promise<Record<string, string>> {
    const resolved: Record<string, string> = {};

    for (const field of fields) {
        const value = fieldData[field.name];
        if (value !== undefined && value !== null) {
            resolved[field.name] = await resolveRelationValue(field, value);
        }
    }

    return resolved;
}

/**
 * Format field value for display based on type
 */
export function formatFieldValue(field: StepFieldConfig, value: any): string {
    if (value === null || value === undefined) return '-';

    switch (field.type) {
        case 'date':
            try {
                return new Date(value).toLocaleDateString();
            } catch {
                return String(value);
            }

        case 'checkbox':
            return value ? 'Yes' : 'No';

        case 'number':
        case 'calculated':
            return typeof value === 'number' ? value.toLocaleString() : String(value);

        default:
            return String(value);
    }
}
