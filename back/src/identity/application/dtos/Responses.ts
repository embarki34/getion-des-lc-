/**
 * Response DTO for user data
 */
export class UserResponse {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string,
        public readonly status: string,
        public readonly emailVerified: boolean,
        public readonly createdAt: Date,
        public readonly lastLoginAt: Date | null
    ) {}
}

/**
 * Response DTO for authentication
 */
export class AuthenticationResponse {
    constructor(
        public readonly accessToken: string,
        public readonly refreshToken: string,
        public readonly expiresIn: number,
        public readonly user: UserResponse
    ) {}
}

/**
 * Response DTO for successful operations
 */
export class SuccessResponse {
    constructor(
        public readonly message: string
    ) {}
}

/**
 * Response DTO for profile data
 */
export class ProfileResponse {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string,
        public readonly emailVerified: boolean,
        public readonly createdAt: Date,
        public readonly lastLoginAt: Date | null
    ) {}
}
