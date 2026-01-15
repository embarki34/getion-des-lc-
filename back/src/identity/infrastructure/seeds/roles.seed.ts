/**
 * Role Definitions for RBAC System
 * Maps roles to their assigned permissions
 */

export interface RoleDefinition {
    code: string;
    name: string;
    description: string;
    isActive: boolean;
    permissions: string[]; // Permission codes
}

/**
 * All system roles with their permissions
 */
export const ROLES: RoleDefinition[] = [
    // ==================== SUPER ADMINISTRATOR ====================
    {
        code: 'SUPER_ADMIN',
        name: 'Super Administrator',
        description: 'Global system administrator with full access across all companies',
        isActive: true,
        permissions: [
            // All system admin permissions
            'role:create:all',
            'role:read:all',
            'role:update:all',
            'role:delete:all',
            'permission:create:all',
            'permission:read:all',
            'permission:assign:all',
            'permission:revoke:all',
            'system-config:read:all',
            'system-config:update:all',
            'audit-log:read:all',
            'report:generate:all',

            // All user management
            'user:create:company',
            'user:read:all',
            'user:update:all',
            'user:delete:all',
            'user:suspend:all',
            'user:activate:all',
            'user:assign-role:all',
            'user:reset-password:all',

            // All company/BU management
            'company:create:all',
            'company:read:all',
            'company:update:all',
            'company:delete:all',
            'business-unit:create:company',
            'business-unit:read:all',
            'business-unit:update:company',
            'business-unit:delete:company',

            // Read-only for financial operations (no approval power)
            'credit-line:read:all',
            'bank:read:all',
            'bank-account:read:company',
            'guarantee:read:all',
            'engagement:read:all',
            'swift:read:all',
            'document:read:all',
        ],
    },

    // ==================== SYSTEM ADMINISTRATOR ====================
    {
        code: 'SYSTEM_ADMIN',
        name: 'System Administrator',
        description: 'Company-level system administrator',
        isActive: true,
        permissions: [
            // Company/BU management
            'company:read:own',
            'company:update:own',
            'business-unit:create:company',
            'business-unit:read:company',
            'business-unit:update:company',
            'business-unit:delete:company',

            // User management (company scope)
            'user:create:company',
            'user:read:company',
            'user:update:company',
            'user:delete:company',
            'user:suspend:company',
            'user:activate:company',
            'user:assign-role:company',
            'user:reset-password:company',

            // Role management (read-only)
            'role:read:all',
            'permission:read:all',

            // Reports and audit
            'audit-log:read:company',
            'report:generate:company',

            // Read access to business data
            'credit-line:read:company',
            'bank:read:company',
            'bank-account:read:company',
            'supplier:read:company',
            'guarantee:read:company',
            'engagement:read:company',
            'swift:read:company',
            'document:read:company',
        ],
    },

    // ==================== FINANCE MANAGER ====================
    {
        code: 'FINANCE_MANAGER',
        name: 'Finance Manager',
        description: 'Manages financial operations and approval workflows',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',
            'user:update:own',

            // Credit line management
            'credit-line:create:company',
            'credit-line:read:company',
            'credit-line:update:company',
            'credit-line:approve:company',
            'credit-line:modify-limits:company',
            'credit-line:view-utilization:company',
            'credit-line:close:company',

            // Bank management
            'bank:create:company',
            'bank:read:company',
            'bank:update:company',
            'bank-account:create:company',
            'bank-account:read:company',
            'bank-account:view-balance:company',
            'bank-account:update:company',
            'bank-account:deactivate:company',

            // Guarantee approval
            'guarantee:create:company',
            'guarantee:read:company',
            'guarantee:update:company',
            'guarantee:approve:company',

            // Engagement approval
            'engagement:read:company',
            'engagement:approve:company',

            // SWIFT operations
            'swift:generate:company',
            'swift:send:company',
            'swift:read:company',

            // Documents
            'document:read:company',
            'document:upload:company',

            // Reporting
            'report:generate:company',
        ],
    },

    // ==================== ACCOUNTANT ====================
    {
        code: 'ACCOUNTANT',
        name: 'Accountant',
        description: 'Financial data entry and reporting',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',
            'user:update:own',

            // Read financial data
            'credit-line:read:company',
            'credit-line:view-utilization:company',
            'bank-account:read:company',

            // Engagement management (no approval)
            'engagement:create:company',
            'engagement:read:company',
            'engagement:update:company',

            // Guarantee read
            'guarantee:read:company',

            // SWIFT read
            'swift:read:company',

            // Documents
            'document:upload:company',
            'document:read:company',

            // Reporting
            'report:generate:company',
        ],
    },

    // ==================== OPERATIONS MANAGER ====================
    {
        code: 'OPERATIONS_MANAGER',
        name: 'Operations Manager',
        description: 'Manages business unit operations',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',
            'user:update:own',

            // User management (BU scope)
            'user:create:business-unit',
            'user:read:business-unit',
            'user:update:business-unit',
            'user:suspend:business-unit',
            'user:activate:business-unit',

            // BU management
            'business-unit:read:own',
            'business-unit:update:own',

            // Supplier management
            'supplier:read:business-unit',
            'supplier:assign-to-bu:company',

            // Financial read access
            'credit-line:read:business-unit',
            'credit-line:view-utilization:business-unit',
            'engagement:read:business-unit',
            'guarantee:read:business-unit',
            'swift:read:business-unit',

            // Documents
            'document:upload:business-unit',
            'document:read:business-unit',
            'document:delete:business-unit',

            // Reporting
            'report:generate:business-unit',
        ],
    },

    // ==================== BUSINESS UNIT MANAGER ====================
    {
        code: 'BU_MANAGER',
        name: 'Business Unit Manager',
        description: 'Manages single business unit',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',
            'user:update:own',

            // User read (BU)
            'user:read:business-unit',

            // BU read
            'business-unit:read:own',

            // Supplier read
            'supplier:read:business-unit',

            // Financial read
            'credit-line:read:business-unit',
            'credit-line:view-utilization:business-unit',
            'engagement:create:business-unit',
            'engagement:read:business-unit',
            'engagement:update:business-unit',
            'guarantee:read:business-unit',
            'swift:read:business-unit',

            // Documents
            'document:upload:business-unit',
            'document:read:business-unit',

            // Reporting
            'report:generate:business-unit',
        ],
    },

    // ==================== OPERATIONS USER ====================
    {
        code: 'OPERATIONS_USER',
        name: 'Operations User',
        description: 'Day-to-day operational tasks',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',
            'user:update:own',

            // Own engagements
            'engagement:create:own',
            'engagement:read:own',
            'engagement:update:own',

            // Read BU data
            'supplier:read:business-unit',
            'credit-line:read:business-unit',
            'guarantee:read:business-unit',
            'swift:read:business-unit',

            // Documents
            'document:upload:own',
            'document:read:own',
            'document:delete:own',
        ],
    },

    // ==================== AUDITOR ====================
    {
        code: 'AUDITOR',
        name: 'Auditor',
        description: 'Read-only access for audit and compliance',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',

            // Read all users
            'user:read:all',

            // Read all companies/BUs
            'company:read:all',
            'business-unit:read:all',

            // Read all financial data
            'credit-line:read:all',
            'credit-line:view-utilization:company',
            'bank:read:all',
            'bank-account:read:company',
            'bank-account:view-balance:company',
            'supplier:read:all',
            'guarantee:read:all',
            'engagement:read:all',
            'swift:read:all',

            // Read all documents
            'document:read:all',

            // Audit logs
            'audit-log:read:all',

            // Reporting
            'report:generate:all',

            // System read-only
            'role:read:all',
            'permission:read:all',
            'system-config:read:all',
        ],
    },

    // ==================== READ-ONLY USER ====================
    {
        code: 'READ_ONLY_USER',
        name: 'Read-Only User',
        description: 'View-only access to assigned scope',
        isActive: true,
        permissions: [
            // Profile management
            'user:read:own',

            // Read BU data
            'business-unit:read:own',
            'credit-line:read:business-unit',
            'supplier:read:business-unit',
            'engagement:read:business-unit',
            'guarantee:read:business-unit',
            'document:read:business-unit',
        ],
    },
];

// Helper functions
export function getRoleByCode(code: string): RoleDefinition | undefined {
    return ROLES.find(r => r.code === code);
}

export function getAllRoleCodes(): string[] {
    return ROLES.map(r => r.code);
}

// Legacy role mapping for migration
export const LEGACY_ROLE_MAPPING: Record<string, string> = {
    'user': 'READ_ONLY_USER',
    'moderator': 'OPERATIONS_MANAGER',
    'admin': 'SYSTEM_ADMIN',
};

export function mapLegacyRole(legacyRole: string): string {
    return LEGACY_ROLE_MAPPING[legacyRole] || 'READ_ONLY_USER';
}
