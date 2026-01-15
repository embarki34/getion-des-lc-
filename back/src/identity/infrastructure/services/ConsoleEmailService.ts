import { IEmailService, EmailData, EmailTemplate } from '../../application/ports/IEmailService';

/**
 * Console implementation of email service (for development)
 * For production, replace with a proper email service (SendGrid, AWS SES, etc.)
 */
export class ConsoleEmailService implements IEmailService {
    /**
     * Sends an email (logs to console)
     */
    async send(emailData: EmailData): Promise<void> {
        console.log('[Email Sent]', {
            to: emailData.to,
            subject: emailData.subject,
            template: emailData.template,
            data: emailData.data,
        });
    }

    /**
     * Sends a welcome email
     */
    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        await this.send({
            to,
            subject: 'Welcome to Our Platform!',
            template: EmailTemplate.WELCOME,
            data: { name },
        });
    }

    /**
     * Sends an email verification email
     */
    async sendVerificationEmail(to: string, name: string, verificationToken: string): Promise<void> {
        await this.send({
            to,
            subject: 'Verify Your Email Address',
            template: EmailTemplate.EMAIL_VERIFICATION,
            data: { name, verificationToken },
        });
    }

    /**
     * Sends a password reset email
     */
    async sendPasswordResetEmail(to: string, name: string, resetToken: string): Promise<void> {
        await this.send({
            to,
            subject: 'Reset Your Password',
            template: EmailTemplate.PASSWORD_RESET,
            data: { name, resetToken },
        });
    }

    /**
     * Sends a password changed notification
     */
    async sendPasswordChangedEmail(to: string, name: string): Promise<void> {
        await this.send({
            to,
            subject: 'Your Password Has Been Changed',
            template: EmailTemplate.PASSWORD_CHANGED,
            data: { name },
        });
    }

    /**
     * Sends an account locked notification
     */
    async sendAccountLockedEmail(to: string, name: string, lockedUntil: Date): Promise<void> {
        await this.send({
            to,
            subject: 'Your Account Has Been Locked',
            template: EmailTemplate.ACCOUNT_LOCKED,
            data: { name, lockedUntil: lockedUntil.toISOString() },
        });
    }
}
