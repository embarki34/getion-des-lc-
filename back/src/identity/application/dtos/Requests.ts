/**
 * Request DTO for user registration
 */
export class RegisterUserRequest {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly password: string,
    public readonly role: string,
    public readonly status: string
  ) {}
}

/**
 * Request DTO for user login
 */
export class LoginRequest {
  constructor(
    public readonly email: string,
    public readonly password: string
  ) {}
}

/**
 * Request DTO for password change
 */
export class ChangePasswordRequest {
  constructor(
    public readonly userId: string,
    public readonly currentPassword: string,
    public readonly newPassword: string
  ) {}
}

/**
 * Request DTO for password reset request
 */
export class RequestPasswordResetRequest {
  constructor(public readonly email: string) {}
}

/**
 * Request DTO for password reset
 */
export class ResetPasswordRequest {
  constructor(
    public readonly token: string,
    public readonly newPassword: string
  ) {}
}

/**
 * Request DTO for updating user profile
 */
export class UpdateProfileRequest {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly phone?: string,
    public readonly status?: string
  ) {}
}

/**
 * Request DTO for email verification
 */
export class VerifyEmailRequest {
  constructor(public readonly token: string) {}
}

/**
 * Request DTO for token refresh
 */
export class RefreshTokenRequest {
  constructor(public readonly refreshToken: string) {}
}
