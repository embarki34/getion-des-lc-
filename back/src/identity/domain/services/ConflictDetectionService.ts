import { Result } from "../../../shared/types/Result";

export interface ValidationResult {
    isValid: boolean;
    conflict?: string[];
    message?: string;
}

/**
 * Service to enforce Separation of Duties (SoD) policies
 * Prevents assigning conflicting permissions to the same user or role
 */
export class ConflictDetectionService {
    /**
     * List of mutually exclusive permission pairs
     * A user/role cannot have both permissions in a pair
     */
    private readonly conflictingPairs: [string, string][] = [
        // Maker-Checker conflicts
        ['credit-line:create:company', 'credit-line:approve:company'],
        ['engagement:create:company', 'engagement:approve:company'],
        ['guarantee:create:company', 'guarantee:approve:company'],

        // Administration conflicts
        ['user:create:company', 'audit-log:read:company'], // Creator shouldn't audit themselves (strict)
        ['system-config:update:all', 'audit-log:read:all'], // Admin shouldn't be able to delete/hide audit logs

        // Financial conflicts
        ['bank-account:create:company', 'bank-account:approve:company'],
        ['swift:generate:company', 'swift:send:company'], // Generation vs Release
    ];

    /**
     * Validate a set of permissions against SoD policies
     * @param permissions Array of permission codes to validate
     * @returns ValidationResult
     */
    public validatePermissions(permissions: string[]): Result<void, Error> {
        const permissionSet = new Set(permissions);

        for (const [perm1, perm2] of this.conflictingPairs) {
            // Check exact matches
            if (permissionSet.has(perm1) && permissionSet.has(perm2)) {
                return Result.fail(new Error(
                    `Separation of Duties violation: Cannot hold both '${perm1}' and '${perm2}'`
                ));
            }

            // Check scope coverage (e.g. if one is :all and other is :company)
            // This is a simplified check - in a full implementation we'd check scope hierarchy
            // For now, we assume precise permission codes
        }

        return Result.ok(void 0);
    }

    /**
     * Check if adding a permission would cause a conflict
     * @param currentPermissions Existing permissions
     * @param newPermission Permission to add
     */
    public checkConflict(currentPermissions: string[], newPermission: string): Result<void, Error> {
        const combined = [...currentPermissions, newPermission];
        return this.validatePermissions(combined);
    }

    /**
     * Get all defined conflict pairs
     */
    public getConflictRules(): [string, string][] {
        return [...this.conflictingPairs];
    }
}
