import { DomainEvent } from './DomainEvent';

/**
 * Event fired when a new user is created
 */
export class UserCreatedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly name: string
    ) {
        super('UserCreated');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
                name: this.name,
            },
        };
    }
}

/**
 * Event fired when a user logs in
 */
export class UserLoggedInEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly loginAt: Date
    ) {
        super('UserLoggedIn');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
                loginAt: this.loginAt.toISOString(),
            },
        };
    }
}

/**
 * Event fired when a user's password is changed
 */
export class PasswordChangedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string
    ) {
        super('PasswordChanged');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
            },
        };
    }
}

/**
 * Event fired when a user's email is verified
 */
export class EmailVerifiedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly verifiedAt: Date
    ) {
        super('EmailVerified');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
                verifiedAt: this.verifiedAt.toISOString(),
            },
        };
    }
}

/**
 * Event fired when an account is deactivated
 */
export class AccountDeactivatedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string
    ) {
        super('AccountDeactivated');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
            },
        };
    }
}

/**
 * Event fired when an account is locked due to failed login attempts
 */
export class AccountLockedEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly lockedUntil: Date
    ) {
        super('AccountLocked');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                email: this.email,
                lockedUntil: this.lockedUntil.toISOString(),
            },
        };
    }
}

/**
 * Event fired when a user's password is reset by an admin
 */
export class PasswordResetByAdminEvent extends DomainEvent {
    constructor(
        public readonly userId: string,
        public readonly userEmail: string,
        public readonly adminId: string,
        public readonly adminEmail: string
    ) {
        super('PasswordResetByAdmin');
    }

    toJSON() {
        return {
            eventType: this.eventType,
            occurredAt: this.occurredAt.toISOString(),
            data: {
                userId: this.userId,
                userEmail: this.userEmail,
                adminId: this.adminId,
                adminEmail: this.adminEmail,
            },
        };
    }
}

