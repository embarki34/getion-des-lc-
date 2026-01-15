/**
 * Account status enumeration
 * Represents the lifecycle states of a user account
 */
export enum AccountStatus {
    /**
     * Account created but email not verified
     */
    PENDING = 'pending',

    /**
     * Account is active and can be used
     */
    ACTIVE = 'active',

    /**
     * Account is temporarily suspended
     */
    SUSPENDED = 'suspended',

    /**
     * Account is soft-deleted
     */
    DELETED = 'deleted',
}

/**
 * Checks if an account can login
 */
export function canLogin(status: AccountStatus): boolean {
    return status === AccountStatus.ACTIVE;
}

/**
 * Checks if an account is in a terminal state
 */
export function isTerminalStatus(status: AccountStatus): boolean {
    return status === AccountStatus.DELETED;
}
