/**
 * Formula Evaluator for Calculated Fields
 * Safely evaluates mathematical formulas using field values
 * Supports: +, -, *, /, Math functions
 */

const ALLOWED_MATH_FUNCTIONS = ['pow', 'sqrt', 'round', 'floor', 'ceil', 'abs', 'min', 'max'];

export interface FormulaContext {
    [fieldName: string]: number | string | boolean | null | undefined;
}

/**
 * Evaluate a formula with given field values
 * @param formula - JavaScript expression string (e.g., "capital * rate")
 * @param context - Object mapping field names to their values
 * @returns Calculated result or null if evaluation fails
 */
export function evaluateFormula(formula: string, context: FormulaContext): number | null {
    if (!formula || !formula.trim()) {
        return null;
    }

    try {
        // Sanitize formula - remove any dangerous code
        const sanitized = sanitizeFormula(formula);

        // Build safe evaluation context
        const contextValues: Record<string, number> = {};
        for (const [key, value] of Object.entries(context)) {
            // Convert to number, skip if NaN
            const numValue = Number(value);
            if (!isNaN(numValue)) {
                contextValues[key] = numValue;
            }
        }

        // Create safe Math proxy with only allowed functions
        const safeMath: any = {};
        for (const fn of ALLOWED_MATH_FUNCTIONS) {
            if (fn in Math) {
                safeMath[fn] = (Math as any)[fn];
            }
        }

        // Evaluate using Function constructor (safer than eval)
        const func = new Function(...Object.keys(contextValues), 'Math', `return ${sanitized};`);
        const result = func(...Object.values(contextValues), safeMath);

        // Validate result
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            return result;
        }

        return null;
    } catch (error) {
        console.error('Formula evaluation error:', error);
        return null;
    }
}

/**
 * Sanitize formula to prevent code injection
 */
function sanitizeFormula(formula: string): string {
    // Remove any comments
    let sanitized = formula.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    // Remove dangerous keywords
    const dangerous = ['eval', 'Function', 'constructor', 'prototype', '__proto__', 'import', 'require', 'process', 'global', 'window', 'document'];
    for (const keyword of dangerous) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        if (regex.test(sanitized)) {
            throw new Error(`Forbidden keyword: ${keyword}`);
        }
    }

    return sanitized;
}

/**
 * Validate formula syntax without evaluating
 */
export function validateFormula(formula: string): { valid: boolean; error?: string } {
    try {
        const sanitized = sanitizeFormula(formula);
        // Try to parse as function
        new Function('return ' + sanitized);
        return { valid: true };
    } catch (error: any) {
        return { valid: false, error: error.message };
    }
}

/**
 * Common formula templates for financial calculations
 */
export const FORMULA_TEMPLATES = {
    // CMT Amortization: A = C × r(1+r)^n / ((1+r)^n - 1)
    cmt_amortization: 'capital * (rate * Math.pow(1 + rate, periods)) / (Math.pow(1 + rate, periods) - 1)',

    // Simple interest
    simple_interest: 'capital * rate * periods',

    // Compound interest
    compound_interest: 'capital * (Math.pow(1 + rate, periods) - 1)',

    // Percentage calculation
    percentage: 'amount * (percentage / 100)',

    // Weighted average
    weighted_average: '(value1 * weight1 + value2 * weight2) / (weight1 + weight2)',
};
