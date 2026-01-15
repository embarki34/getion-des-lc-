/**
 * Email template types
 */
export enum EmailTemplate {
    WELCOME = 'welcome',
    EMAIL_VERIFICATION = 'email_verification',
    PASSWORD_RESET = 'password_reset',
    PASSWORD_CHANGED = 'password_changed',
    ACCOUNT_LOCKED = 'account_locked',
}

/**
 * Email data interface
 */
export interface EmailData {
    to: string;
    subject: string;
    template: EmailTemplate;
    data: Record<string, any>;
}

/**
 * Port for email service
 * Handles sending emails
 */
export interface IEmailService {
    /**
     * Sends an email
     */
    send(emailData: EmailData): Promise<void>;

    /**
     * Sends a welcome email
     */
    sendWelcomeEmail(to: string, name: string): Promise<void>;

    /**
     * Sends an email verification email
     */
    sendVerificationEmail(to: string, name: string, verificationToken: string): Promise<void>;

    /**
     * Sends a password reset email
     */
    sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void>;

    /**
     * Sends a password changed notification
     */
    sendPasswordChangedEmail(to: string, name: string): Promise<void>;

    /**
     * Sends an account locked notification
     */
    sendAccountLockedEmail(to: string, name: string, lockedUntil: Date): Promise<void>;
}
