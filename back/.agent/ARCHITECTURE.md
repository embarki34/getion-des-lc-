# API Standard Architecture

## Overview
This is a unified API server that integrates three main modules using Hexagonal Architecture and Domain-Driven Design (DDD):

1. **Identity Module** - User authentication and authorization
2. **Credit Line Module** - Credit line management
3. **SWIFT Module** - SWIFT message handling

## Project Structure

```
src/
├── index.ts                    # Main entry point
├── app.ts                      # Unified application configuration
├── identity/                   # Identity module
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│       ├── config/
│       │   └── DIContainer.ts
│       └── express/
│           ├── routes/
│           │   ├── auth.routes.ts
│           │   └── user.routes.ts
│           ├── controller/
│           └── middleware/
│               └── ErrorHandlerMiddleware.ts
├── credit-line/                # Credit Line module
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│       ├── config/
│       │   └── DIContainer.ts
│       └── routes/
│           └── creditLine.routes.ts
├── bank-swift/                 # SWIFT module
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│       ├── config/
│       │   └── DIContainer.ts
│       └── routes/
│           └── swift.routes.ts
└── shared/                     # Shared utilities
    ├── domain/
    ├── errors/
    └── infrastructure/
        └── middleware/
            ├── error.middleware.ts
            └── validation.middleware.ts
```

## Entry Points

### Main Entry Point
- **File**: `src/index.ts`
- **Purpose**: Starts the unified server with all modules
- **Command**: `npm run dev`

### Module-Specific Entry Points (for development)
- **Identity**: `src/identity/infrastructure/express/app.ts`
  - Command: `npm run dev:identity`
- **Credit Line**: `src/app.ts`
  - Command: `npm run dev:credit-line`

## Application Configuration

The `App` class in `src/app.ts` handles:

1. **Middleware Setup**
   - Body parsers (JSON, URL-encoded)
   - CORS configuration
   - Request logging

2. **Route Registration**
   - Identity routes: `/api/v1/auth`, `/api/v1/users`
   - Credit Line routes: `/api/v1/credit-lines`
   - SWIFT routes: `/api/v1/swift`

3. **Error Handling**
   - Comprehensive error handler from Identity module
   - Fallback shared error handler
   - 404 handler for undefined routes

4. **Graceful Shutdown**
   - SIGTERM and SIGINT handlers
   - Cleanup of resources

## API Endpoints

### Identity Module (`/api/v1`)
- `POST /auth/register` - Register a new user
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /users/me` - Get current user profile
- `PUT /users/me/password` - Change password
- `GET /users/:id` - Get user by ID (Admin only)

### Credit Line Module (`/api/v1`)
- `GET /credit-lines` - List all credit lines
- `POST /credit-lines` - Create a new credit line
- `GET /credit-lines/:id` - Get credit line by ID
- `PUT /credit-lines/:id` - Update credit line

### SWIFT Module (`/api/v1`)
- `GET /swift` - List SWIFT messages
- `POST /swift` - Create SWIFT message
- `GET /swift/:id` - Get SWIFT message by ID

### Health Check
- `GET /health` - Server health status

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- Database and other module-specific variables

## Running the Application

### Development
```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run migrate

# Start development server
npm run dev
```

### Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Error Handling

The application uses a layered error handling approach:

1. **Domain Exceptions** - Business logic errors
2. **Validation Errors** - Input validation failures (Zod)
3. **Base Errors** - Application-level errors
4. **Generic Errors** - Unexpected errors

All errors are formatted consistently with:
- Error code
- Error message
- Timestamp
- Request path

## Dependency Injection

Each module uses its own DI container:
- `identity/infrastructure/config/DIContainer.ts`
- `credit-line/infrastructure/config/DIContainer.ts`
- `bank-swift/infrastructure/config/DIContainer.ts`

Containers manage:
- Controllers
- Use cases
- Repositories
- Services
- Middleware

## Key Features

1. **Modular Architecture** - Each module is independent and can be developed separately
2. **Unified API** - Single entry point for all modules
3. **Comprehensive Logging** - Request/response logging with Pino
4. **Error Handling** - Consistent error responses across all modules
5. **CORS Support** - Configured for cross-origin requests
6. **Health Checks** - Monitor server status
7. **Graceful Shutdown** - Clean resource cleanup on termination

## Development Guidelines

1. **Adding New Modules**
   - Create module directory under `src/`
   - Implement domain, application, and infrastructure layers
   - Create DI container
   - Register routes in `src/app.ts`

2. **Adding New Endpoints**
   - Define routes in module's route file
   - Implement controller methods
   - Add validation middleware if needed
   - Update this documentation

3. **Error Handling**
   - Use domain exceptions for business logic errors
   - Use Zod for input validation
   - Let the global error handler format responses

4. **Testing**
   - Write unit tests for domain logic
   - Write integration tests for API endpoints
   - Use `npm test` to run tests
