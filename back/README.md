# 🔐 Identity Module - Production-Ready Authentication System

A world-class identity management system built with **Hexagonal Architecture** principles, following **Domain-Driven Design** and **SOLID** patterns.

---

## ✨ Features

### 🔒 Security
- ✅ **Strong Password Validation** - Min 8 chars, uppercase, lowercase, digit, special character
- ✅ **Account Lockout** - 5 failed attempts = 15-minute lockout
- ✅ **Email Verification** - Required before login
- ✅ **JWT Tokens** - Access + Refresh token strategy
- ✅ **Bcrypt Hashing** - Configurable rounds (default: 10)

### 🏗️ Architecture
- ✅ **Hexagonal Architecture** - Clean separation of concerns
- ✅ **Domain-Driven Design** - Rich domain models with business logic
- ✅ **SOLID Principles** - Maintainable and extensible code
- ✅ **Value Objects** - Email, Password, UserId with built-in validation
- ✅ **Domain Events** - Event-driven architecture support
- ✅ **Result Type** - Functional error handling

### 📊 Features
- ✅ User Registration
- ✅ User Login
- ✅ Token Refresh
- ✅ Password Change
- ✅ User Profile Management
- ✅ Role-Based Access Control (USER, ADMIN, MODERATOR)
- ✅ Account Status Management (PENDING, ACTIVE, SUSPENDED, DELETED)

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL database
- pnpm package manager

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp .env.example .env

# 3. Update .env with your configuration
# - Set DATABASE_URL
# - Set JWT secrets
# - Configure other settings

# 4. Generate Prisma client
pnpm prisma:generate

# 5. Run database migrations
pnpm migrate

# 6. Start the server
pnpm dev:identity
```

The server will start on `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

#### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

### User Management

#### Get Profile
```http
GET /api/v1/users/me
Authorization: Bearer <access_token>
```

#### Change Password
```http
PUT /api/v1/users/me/password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

#### Get User by ID (Admin Only)
```http
GET /api/v1/users/:id
Authorization: Bearer <access_token>
```

---

## 🏗️ Architecture

### Project Structure

```
src/identity/
├── domain/                          # Business Logic
│   ├── entities/
│   │   └── User.ts                 # User aggregate root
│   ├── value-objects/
│   │   ├── Email.ts
│   │   ├── Password.ts
│   │   ├── UserId.ts
│   │   ├── UserRole.ts
│   │   └── AccountStatus.ts
│   ├── events/
│   │   └── IdentityEvents.ts
│   ├── exceptions/
│   │   └── DomainExceptions.ts
│   └── services/
│       └── IPasswordHashingService.ts
│
├── application/                     # Use Cases
│   ├── use-cases/
│   │   ├── authentication/
│   │   │   ├── RegisterUserUseCase.ts
│   │   │   ├── LoginUserUseCase.ts
│   │   │   └── RefreshTokenUseCase.ts
│   │   └── user-management/
│   │       ├── GetUserProfileUseCase.ts
│   │       └── ChangePasswordUseCase.ts
│   ├── ports/
│   │   ├── IUserRepository.ts
│   │   ├── ITokenService.ts
│   │   ├── IEmailService.ts
│   │   └── IEventPublisher.ts
│   └── dtos/
│       ├── Requests.ts
│       └── Responses.ts
│
├── infrastructure/                  # External Adapters
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
│   ├── express/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── app.ts
│   └── config/
│       └── DIContainer.ts
│
└── shared/                          # Shared Utilities
    ├── types/
    │   └── Result.ts
    └── errors/
        ├── BaseError.ts
        ├── ErrorCodes.ts
        └── ConcreteErrors.ts
```

### Design Patterns

- **Repository Pattern** - Data access abstraction
- **Dependency Injection** - Loose coupling
- **Factory Pattern** - Entity creation
- **Strategy Pattern** - Multiple implementations
- **Observer Pattern** - Domain events
- **Adapter Pattern** - External service integration

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

---

## 📖 Documentation

Comprehensive documentation is available in the `.agent/` directory:

- **[Architecture Analysis](.agent/IDENTITY_MODULE_ANALYSIS.md)** - Detailed architecture analysis and enhancement plan
- **[Implementation Guide](.agent/IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation instructions
- **[Quick Reference](.agent/QUICK_REFERENCE.md)** - Quick reference for developers
- **[Executive Summary](.agent/EXECUTIVE_SUMMARY.md)** - Project overview and status

---

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

**Critical Settings:**
- `DATABASE_URL` - MySQL connection string
- `JWT_ACCESS_SECRET` - Secret for access tokens (min 32 chars)
- `JWT_REFRESH_SECRET` - Secret for refresh tokens (min 32 chars)
- `BCRYPT_ROUNDS` - Bcrypt hashing rounds (default: 10)

---

## 🚢 Deployment

### Database Migration

```bash
# Development
pnpm migrate

# Production
pnpm migrate:deploy
```

### Production Checklist

- [ ] Set strong JWT secrets (min 32 characters)
- [ ] Configure production database
- [ ] Set `NODE_ENV=production`
- [ ] Configure real email service (replace ConsoleEmailService)
- [ ] Set up message broker for events (replace InMemoryEventPublisher)
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up error tracking (Sentry, etc.)

---

## 🔐 Security Best Practices

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

### Token Security
- Access tokens expire in 1 hour (configurable)
- Refresh tokens expire in 7 days (configurable)
- Tokens are signed with strong secrets
- Token validation on every protected route

### Account Protection
- Account lockout after 5 failed attempts
- 15-minute lockout duration
- Email verification required
- Secure password hashing with bcrypt

---

## 🤝 Contributing

When adding new features:

1. Start with the **domain layer** (entities, value objects)
2. Define **ports** in the application layer
3. Implement **use cases** with business logic
4. Create **adapters** in the infrastructure layer
5. Write **tests** for all layers
6. Update **documentation**

---

## 📊 Error Codes

All errors include a standardized error code:

| Code Range | Category |
|------------|----------|
| 1000-1999 | Validation Errors |
| 2000-2999 | Authentication Errors |
| 3000-3999 | User Management Errors |
| 4000-4999 | Permission Errors |
| 5000-5999 | System Errors |

See `src/identity/shared/errors/ErrorCodes.ts` for complete list.

---

## 📝 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with:
- **Hexagonal Architecture** by Alistair Cockburn
- **Domain-Driven Design** by Eric Evans
- **SOLID Principles** by Robert C. Martin

---

## 📞 Support

For questions or issues:
- Review the documentation in `.agent/`
- Check the implementation examples
- Consult the quick reference guide

---

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: 2025-11-30