# Identity Module - Implementation Guide

## Overview

This guide provides step-by-step instructions for implementing and deploying the enhanced identity module following Hexagonal Architecture principles.

---

## Prerequisites

- Node.js (v16 or higher)
- MySQL database
- pnpm package manager

---

## Installation Steps

### 1. Install Required Dependencies

```bash
# Navigate to project directory
cd "e:\Projects\Gestion LC\api-standard"

# Install new dependencies
pnpm add uuid

# Install dev dependencies (if not already installed)
pnpm add -D @types/uuid
```

### 2. Generate Prisma Client

```bash
# Generate Prisma client with new schema
pnpm prisma generate

# Create and run migration
pnpm prisma migrate dev --name add_identity_enhancements
```

### 3. Environment Configuration

Create or update `.env` file in the project root:

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/your_database"

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10

# Application
NODE_ENV=development
PORT=6000
LOG_LEVEL=info

# Email (for production, configure real SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASSWORD=password
EMAIL_FROM=noreply@example.com
```

---

## Project Structure

The enhanced identity module follows this structure:

```
src/identity/
├── domain/                          # Domain layer (business logic)
│   ├── entities/
│   │   └── User.ts                 # User aggregate root
│   ├── value-objects/
│   │   ├── Email.ts                # Email value object
│   │   ├── Password.ts             # Password value object
│   │   ├── UserId.ts               # User ID value object
│   │   ├── UserRole.ts             # Role enumeration
│   │   └── AccountStatus.ts        # Account status enumeration
│   ├── events/
│   │   ├── DomainEvent.ts          # Base domain event
│   │   └── IdentityEvents.ts       # Identity-specific events
│   ├── exceptions/
│   │   └── DomainExceptions.ts     # Domain exceptions
│   └── services/
│       └── IPasswordHashingService.ts  # Password hashing interface
│
├── application/                     # Application layer (use cases)
│   ├── use-cases/
│   │   ├── authentication/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   ├── LoginUserUseCase.ts
│   │   │   └── RefreshTokenUseCase.ts
│   │   └── user-management/
│   │       ├── GetUserProfileUseCase.ts
│   │       └── ChangePasswordUseCase.ts
│   ├── ports/
│   │   ├── IUserRepository.ts      # Repository interface
│   │   ├── ITokenService.ts        # Token service interface
│   │   ├── IEmailService.ts        # Email service interface
│   │   └── IEventPublisher.ts      # Event publisher interface
│   └── dtos/
│       ├── Requests.ts             # Request DTOs
│       └── Responses.ts            # Response DTOs
│
├── infrastructure/                  # Infrastructure layer (adapters)
│   ├── persistence/
│   │   ├── repositories/
│   │   │   └── PrismaUserRepository.ts
│   │   └── mappers/
│   │       └── UserMapper.ts
│   ├── services/
│   │   ├── BcryptPasswordHashingService.ts
│   │   ├── JwtTokenService.ts
│   │   ├── ConsoleEmailService.ts
│   │   └── InMemoryEventPublisher.ts
│   └── express/
│       ├── controllers/
│       ├── routes/
│       └── middleware/
│
└── shared/                          # Shared utilities
    ├── types/
    │   └── Result.ts               # Result type for error handling
    └── errors/
        ├── BaseError.ts            # Base error class
        ├── ErrorCodes.ts           # Error code constants
        └── ConcreteErrors.ts       # Concrete error implementations
```

---

## Usage Examples

### 1. Register a New User

```typescript
import { RegisterUserUseCase } from './application/use-cases/authentication/RegisterUserUseCase';
import { RegisterUserRequest } from './application/dtos/Requests';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/PrismaUserRepository';
import { BcryptPasswordHashingService } from './infrastructure/services/BcryptPasswordHashingService';
import { InMemoryEventPublisher } from './infrastructure/services/InMemoryEventPublisher';
import { ConsoleEmailService } from './infrastructure/services/ConsoleEmailService';
import { prisma } from './infrastructure/persistence/prisma-orm-client';

// Initialize dependencies
const userRepository = new PrismaUserRepository(prisma);
const passwordHashingService = new BcryptPasswordHashingService(10);
const eventPublisher = new InMemoryEventPublisher();
const emailService = new ConsoleEmailService();

// Create use case
const registerUserUseCase = new RegisterUserUseCase(
    userRepository,
    passwordHashingService,
    eventPublisher,
    emailService
);

// Execute use case
const request = new RegisterUserRequest(
    'John Doe',
    'john@example.com',
    'SecurePassword123!'
);

const result = await registerUserUseCase.execute(request);

if (result.isSuccess()) {
    const user = result.getValue();
    console.log('User registered:', user);
} else {
    const error = result.getError();
    console.error('Registration failed:', error.message);
}
```

### 2. Login User

```typescript
import { LoginUserUseCase } from './application/use-cases/authentication/LoginUserUseCase';
import { LoginRequest } from './application/dtos/Requests';
import { JwtTokenService } from './infrastructure/services/JwtTokenService';

// Initialize token service
const tokenService = new JwtTokenService({
    accessTokenSecret: process.env.JWT_ACCESS_SECRET!,
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET!,
    accessTokenExpiresIn: '1h',
    refreshTokenExpiresIn: '7d',
});

// Create use case
const loginUserUseCase = new LoginUserUseCase(
    userRepository,
    passwordHashingService,
    tokenService,
    eventPublisher
);

// Execute use case
const loginRequest = new LoginRequest(
    'john@example.com',
    'SecurePassword123!'
);

const result = await loginUserUseCase.execute(loginRequest);

if (result.isSuccess()) {
    const authResponse = result.getValue();
    console.log('Access Token:', authResponse.accessToken);
    console.log('Refresh Token:', authResponse.refreshToken);
    console.log('User:', authResponse.user);
} else {
    const error = result.getError();
    console.error('Login failed:', error.message);
}
```

---

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

### Writing Tests

Example test for RegisterUserUseCase:

```typescript
import { RegisterUserUseCase } from '../RegisterUserUseCase';
import { FakeUserRepository } from '../../../../test/fakes/FakeUserRepository';
import { FakePasswordHashingService } from '../../../../test/fakes/FakePasswordHashingService';
import { FakeEventPublisher } from '../../../../test/fakes/FakeEventPublisher';
import { FakeEmailService } from '../../../../test/fakes/FakeEmailService';

describe('RegisterUserUseCase', () => {
    let useCase: RegisterUserUseCase;
    let userRepository: FakeUserRepository;
    let passwordHashingService: FakePasswordHashingService;
    let eventPublisher: FakeEventPublisher;
    let emailService: FakeEmailService;

    beforeEach(() => {
        userRepository = new FakeUserRepository();
        passwordHashingService = new FakePasswordHashingService();
        eventPublisher = new FakeEventPublisher();
        emailService = new FakeEmailService();
        
        useCase = new RegisterUserUseCase(
            userRepository,
            passwordHashingService,
            eventPublisher,
            emailService
        );
    });

    it('should register a new user successfully', async () => {
        const request = new RegisterUserRequest(
            'John Doe',
            'john@example.com',
            'SecurePassword123!'
        );

        const result = await useCase.execute(request);

        expect(result.isSuccess()).toBe(true);
        const user = result.getValue();
        expect(user.name).toBe('John Doe');
        expect(user.email).toBe('john@example.com');
    });

    it('should fail when user already exists', async () => {
        // First registration
        await useCase.execute(new RegisterUserRequest(
            'John Doe',
            'john@example.com',
            'SecurePassword123!'
        ));

        // Second registration with same email
        const result = await useCase.execute(new RegisterUserRequest(
            'Jane Doe',
            'john@example.com',
            'AnotherPassword123!'
        ));

        expect(result.isFailure()).toBe(true);
        expect(result.getError().code).toBe('IDENTITY_3000');
    });
});
```

---

## Migration from Old to New Implementation

### Step 1: Update Existing Code

The old user-related files can be gradually migrated:

1. **Keep old files temporarily** for backward compatibility
2. **Create new controllers** using the new use cases
3. **Update routes** to use new controllers
4. **Test thoroughly** before removing old code

### Step 2: Database Migration

```bash
# Run the migration
pnpm prisma migrate dev --name add_identity_enhancements

# Verify migration
pnpm prisma studio
```

### Step 3: Update Existing Users

If you have existing users in the database, you may need to:

1. Set default values for new fields
2. Mark existing users as verified (or send verification emails)
3. Set account status to 'active'

```sql
-- Update existing users
UPDATE users 
SET 
    status = 'active',
    emailVerified = true,
    emailVerifiedAt = NOW(),
    failedLoginAttempts = 0
WHERE status IS NULL;
```

---

## Production Considerations

### 1. Email Service

Replace `ConsoleEmailService` with a real email service:

```typescript
import { IEmailService } from './application/ports/IEmailService';
import nodemailer from 'nodemailer';

export class NodemailerEmailService implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }

    async send(emailData: EmailData): Promise<void> {
        await this.transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: emailData.to,
            subject: emailData.subject,
            html: this.renderTemplate(emailData.template, emailData.data),
        });
    }

    // Implement other methods...
}
```

### 2. Event Publisher

Replace `InMemoryEventPublisher` with a message broker:

```typescript
import { IEventPublisher } from './application/ports/IEventPublisher';
import { DomainEvent } from './domain/events/DomainEvent';
import amqp from 'amqplib';

export class RabbitMQEventPublisher implements IEventPublisher {
    private connection: amqp.Connection;
    private channel: amqp.Channel;

    async publish(event: DomainEvent): Promise<void> {
        const message = JSON.stringify(event.toJSON());
        this.channel.publish(
            'identity-events',
            event.eventType,
            Buffer.from(message)
        );
    }

    // Implement connection setup and other methods...
}
```

### 3. Security Enhancements

- Use environment variables for all secrets
- Implement rate limiting
- Add CORS configuration
- Enable HTTPS in production
- Implement request validation middleware
- Add security headers (helmet.js)

### 4. Monitoring & Logging

- Implement structured logging (Winston, Pino)
- Add application performance monitoring (APM)
- Set up error tracking (Sentry, Rollbar)
- Monitor database performance
- Track business metrics

---

## API Endpoints

### Authentication

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
```

### User Management

```
GET    /api/v1/users/me
PUT    /api/v1/users/me
DELETE /api/v1/users/me
PUT    /api/v1/users/me/password
```

---

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Run `pnpm install` to ensure all dependencies are installed
   - Check import paths are correct

2. **Prisma client errors**
   - Run `pnpm prisma generate` to regenerate the client
   - Ensure database connection string is correct

3. **TypeScript errors**
   - Ensure `@types/uuid` is installed
   - Check `tsconfig.json` configuration

4. **Database migration errors**
   - Check database connection
   - Ensure MySQL is running
   - Verify database user has proper permissions

---

## Next Steps

1. ✅ Complete Phase 1: Foundation (Value Objects, Domain Entities)
2. ✅ Complete Phase 2: Core Use Cases (Register, Login, Refresh)
3. ⏳ Implement remaining use cases (Email Verification, Password Reset)
4. ⏳ Create Express controllers and routes
5. ⏳ Add validation middleware
6. ⏳ Implement comprehensive tests
7. ⏳ Add API documentation (Swagger)
8. ⏳ Production deployment

---

## Support & Resources

- **Architecture Documentation**: See `.agent/IDENTITY_MODULE_ANALYSIS.md`
- **Hexagonal Architecture**: https://alistair.cockburn.us/hexagonal-architecture/
- **Domain-Driven Design**: https://martinfowler.com/bliki/DomainDrivenDesign.html
- **SOLID Principles**: https://en.wikipedia.org/wiki/SOLID

---

## License

[Your License Here]
