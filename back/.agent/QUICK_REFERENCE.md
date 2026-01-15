# Identity Module - Quick Reference Guide

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm prisma generate

# Run migration
pnpm prisma migrate dev --name add_identity_enhancements
```

### Environment Setup
Create `.env` file:
```env
DATABASE_URL="mysql://user:password@localhost:3306/db"
JWT_ACCESS_SECRET=your-access-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

---

## 📚 Core Concepts

### Value Objects
```typescript
// Email - Always valid and normalized
const email = Email.create('user@example.com');

// Password - Enforces strength requirements
const password = Password.create('SecurePass123!');

// UserId - UUID-based identifier
const userId = UserId.generate();
const existingId = UserId.fromString('uuid-string');
```

### User Entity
```typescript
// Create new user
const user = User.create(name, email, password, UserRole.USER);

// Verify email
user.verifyEmail();

// Change password
user.changePassword(newPassword);

// Check if can login
user.canLogin(); // Throws if locked, not verified, or deactivated
```

### Result Type
```typescript
const result = await useCase.execute(request);

if (result.isSuccess()) {
    const value = result.getValue();
    // Handle success
} else {
    const error = result.getError();
    // Handle error
}
```

---

## 🔧 Common Use Cases

### Register User
```typescript
const registerUseCase = new RegisterUserUseCase(
    userRepository,
    passwordHashingService,
    eventPublisher,
    emailService
);

const request = new RegisterUserRequest(
    'John Doe',
    'john@example.com',
    'SecurePass123!'
);

const result = await registerUseCase.execute(request);
```

### Login User
```typescript
const loginUseCase = new LoginUserUseCase(
    userRepository,
    passwordHashingService,
    tokenService,
    eventPublisher
);

const request = new LoginRequest(
    'john@example.com',
    'SecurePass123!'
);

const result = await loginUseCase.execute(request);

if (result.isSuccess()) {
    const auth = result.getValue();
    console.log(auth.accessToken);
    console.log(auth.refreshToken);
}
```

### Refresh Token
```typescript
const refreshUseCase = new RefreshTokenUseCase(tokenService);

const request = new RefreshTokenRequest(refreshToken);

const result = await refreshUseCase.execute(request);
```

### Get User Profile
```typescript
const profileUseCase = new GetUserProfileUseCase(userRepository);

const result = await profileUseCase.execute(userId);
```

### Change Password
```typescript
const changePasswordUseCase = new ChangePasswordUseCase(
    userRepository,
    passwordHashingService,
    eventPublisher,
    emailService
);

const request = new ChangePasswordRequest(
    userId,
    'CurrentPass123!',
    'NewPass456!'
);

const result = await changePasswordUseCase.execute(request);
```

---

## 🏗️ Dependency Injection Setup

```typescript
import { PrismaClient } from '@prisma/client';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/PrismaUserRepository';
import { BcryptPasswordHashingService } from './infrastructure/services/BcryptPasswordHashingService';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';
import { ConsoleEmailService } from './infrastructure/services/ConsoleEmailService';
import { InMemoryEventPublisher } from './infrastructure/services/InMemoryEventPublisher';

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize repositories
const userRepository = new PrismaUserRepository(prisma);

// Initialize services
const passwordHashingService = new BcryptPasswordHashingService(
    parseInt(process.env.BCRYPT_ROUNDS || '10')
);

const tokenService = new JwtTokenService({
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
});

const emailService = new ConsoleEmailService();
const eventPublisher = new InMemoryEventPublisher();

// Initialize use cases
const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    passwordHashingService,
    eventPublisher,
    emailService
);

const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    passwordHashingService,
    tokenService,
    eventPublisher
);

// Export for use in controllers
export {
    registerUserUseCase,
    loginUserUseCase,
    // ... other use cases
};
```

---

## 🎯 Error Handling

### Domain Exceptions
```typescript
try {
    const email = Email.create('invalid-email');
} catch (error) {
    if (error instanceof InvalidEmailException) {
        console.log(error.code); // IDENTITY_1001
        console.log(error.message);
    }
}
```

### Use Case Errors
```typescript
const result = await registerUserUseCase.execute(request);

if (result.isFailure()) {
    const error = result.getError();
    
    if (error instanceof UserAlreadyExistsException) {
        // Handle duplicate user
    } else if (error instanceof InvalidEmailException) {
        // Handle invalid email
    } else {
        // Handle other errors
    }
}
```

### Error Codes
```typescript
import { ErrorCodes } from './shared/errors/ErrorCodes';

// Use error codes for client responses
if (error.code === ErrorCodes.USER_ALREADY_EXISTS) {
    return res.status(409).json({
        error: {
            code: error.code,
            message: error.message,
        },
    });
}
```

---

## 🔐 Security Features

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### Account Lockout
- 5 failed login attempts
- 15-minute lockout duration
- Automatic unlock after duration

### Email Verification
- Required before login
- Prevents unauthorized access

### Token Management
- Access token: Short-lived (1 hour default)
- Refresh token: Long-lived (7 days default)
- Secure token validation

---

## 📊 Domain Events

### Publishing Events
```typescript
// Events are automatically published by use cases
const event = new UserCreatedEvent(userId, email, name);
await eventPublisher.publish(event);
```

### Available Events
- `UserCreatedEvent`
- `UserLoggedInEvent`
- `PasswordChangedEvent`
- `EmailVerifiedEvent`
- `AccountDeactivatedEvent`
- `AccountLockedEvent`

---

## 🧪 Testing

### Unit Test Example
```typescript
describe('RegisterUserUseCase', () => {
    let useCase: RegisterUserUseCase;
    let fakeUserRepository: FakeUserRepository;
    
    beforeEach(() => {
        fakeUserRepository = new FakeUserRepository();
        // ... initialize other fakes
        
        useCase = new RegisterUserUseCase(
            fakeUserRepository,
            fakePasswordHashingService,
            fakeEventPublisher,
            fakeEmailService
        );
    });
    
    it('should register user successfully', async () => {
        const request = new RegisterUserRequest(
            'John Doe',
            'john@example.com',
            'SecurePass123!'
        );
        
        const result = await useCase.execute(request);
        
        expect(result.isSuccess()).toBe(true);
    });
});
```

---

## 📖 Additional Resources

- **Architecture Analysis**: `.agent/IDENTITY_MODULE_ANALYSIS.md`
- **Implementation Guide**: `.agent/IMPLEMENTATION_GUIDE.md`
- **Executive Summary**: `.agent/EXECUTIVE_SUMMARY.md`

---

## 🆘 Troubleshooting

### "Cannot find module 'uuid'"
```bash
pnpm install uuid @types/uuid
```

### "Prisma client not generated"
```bash
pnpm prisma generate
```

### "Database migration failed"
```bash
# Check database connection
# Ensure MySQL is running
# Verify DATABASE_URL in .env
pnpm prisma migrate reset
```

### TypeScript errors
```bash
# Ensure all dependencies are installed
pnpm install

# Regenerate Prisma client
pnpm prisma generate
```

---

*Quick Reference v1.0.0*
