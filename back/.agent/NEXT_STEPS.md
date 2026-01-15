# 🎯 Next Steps & Deployment Guide

## 📋 Immediate Action Items

### 1. Install Dependencies ⚡
```bash
cd "e:\Projects\Gestion LC\api-standard"
pnpm install
```

**Expected Result**: All dependencies including `uuid`, `bcryptjs`, `jsonwebtoken`, and `express` will be installed.

---

### 2. Generate Prisma Client 🔧
```bash
pnpm prisma:generate
```

**Expected Result**: Prisma client will be generated in `src/identity/infrastructure/persistence/prisma/client/`

---

### 3. Setup Environment 🌍
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and configure:
# - DATABASE_URL (your MySQL connection string)
# - JWT_ACCESS_SECRET (generate a strong secret)
# - JWT_REFRESH_SECRET (generate a different strong secret)
```

**Generate Strong Secrets**:
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

---

### 4. Run Database Migration 🗄️
```bash
pnpm migrate
```

**Expected Result**: New database tables will be created with enhanced user schema.

---

### 5. Start the Server 🚀
```bash
pnpm dev:identity
```

**Expected Result**: Server starts on http://localhost:6000

---

## ✅ Verification Steps

### Test the API

#### 1. Health Check
```bash
curl http://localhost:6000/health
```

Expected Response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-30T...",
  "service": "identity-api"
}
```

#### 2. Register a User
```bash
curl -X POST http://localhost:6000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

#### 3. Login
```bash
curl -X POST http://localhost:6000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Save the `accessToken` from the response.

#### 4. Get Profile
```bash
curl http://localhost:6000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔄 Migration from Old Implementation

### Option 1: Gradual Migration (Recommended)

1. **Keep both implementations running**
   - Old: `pnpm dev` (port 6000)
   - New: `pnpm dev:identity` (port 6001 - update in .env)

2. **Route new users to new implementation**
   - Update frontend to use new endpoints
   - Keep existing users on old system

3. **Migrate existing users**
   - Run data migration script (see below)
   - Update user records with new fields

4. **Switch over completely**
   - Point all traffic to new implementation
   - Deprecate old implementation

### Option 2: Clean Switch

1. **Backup database**
   ```bash
   mysqldump -u root -p identity_db > backup.sql
   ```

2. **Run migration**
   ```bash
   pnpm migrate
   ```

3. **Update existing users**
   ```sql
   UPDATE users 
   SET 
     status = 'active',
     emailVerified = true,
     emailVerifiedAt = NOW(),
     failedLoginAttempts = 0
   WHERE status IS NULL;
   ```

4. **Switch to new implementation**
   - Update package.json dev script
   - Restart server

---

## 📊 Database Migration Script

Create `scripts/migrate-users.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Starting user migration...');

  const result = await prisma.user.updateMany({
    where: {
      status: null,
    },
    data: {
      status: 'active',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      failedLoginAttempts: 0,
    },
  });

  console.log(`Migrated ${result.count} users`);
}

migrateUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run with:
```bash
ts-node scripts/migrate-users.ts
```

---

## 🔧 Production Setup

### 1. Environment Configuration

**Production .env**:
```env
NODE_ENV=production
DATABASE_URL="mysql://user:password@prod-db:3306/identity_db"
JWT_ACCESS_SECRET=<64-char-random-string>
JWT_REFRESH_SECRET=<64-char-random-string>
BCRYPT_ROUNDS=12
PORT=6000
```

### 2. Replace Development Services

#### Email Service
Replace `ConsoleEmailService` with real email service:

```typescript
// src/identity/infrastructure/services/NodemailerEmailService.ts
import nodemailer from 'nodemailer';
import { IEmailService, EmailData } from '../../application/ports/IEmailService';

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

Update DIContainer to use NodemailerEmailService in production.

#### Event Publisher
Replace `InMemoryEventPublisher` with message broker (RabbitMQ, Kafka, etc.)

### 3. Add Production Dependencies

```bash
pnpm add nodemailer amqplib
pnpm add -D @types/nodemailer @types/amqplib
```

### 4. Security Enhancements

#### Add Rate Limiting
```bash
pnpm add express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

#### Add Helmet for Security Headers
```bash
pnpm add helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

#### Add CORS Configuration
```bash
pnpm add cors
```

```typescript
import cors from 'cors';

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
```

---

## 📈 Monitoring & Logging

### 1. Add Structured Logging

```bash
pnpm add winston
```

```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### 2. Add Error Tracking

```bash
pnpm add @sentry/node
```

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🧪 Testing Setup

### 1. Create Test Database

```sql
CREATE DATABASE identity_db_test;
```

### 2. Update Test Environment

Create `.env.test`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/identity_db_test"
JWT_ACCESS_SECRET=test-access-secret
JWT_REFRESH_SECRET=test-refresh-secret
NODE_ENV=test
```

### 3. Run Tests

```bash
pnpm test
```

---

## 📦 Docker Deployment

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Generate Prisma client
RUN pnpm prisma:generate

# Build TypeScript
RUN pnpm build

# Expose port
EXPOSE 6000

# Start server
CMD ["node", "dist/identity/infrastructure/express/app.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "6000:6000"
    environment:
      - DATABASE_URL=mysql://root:password@db:3306/identity_db
      - JWT_ACCESS_SECRET=${JWT_ACCESS_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=identity_db
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## ✅ Final Checklist

### Before Going Live

- [ ] All dependencies installed
- [ ] Environment variables configured
- [ ] Database migrated
- [ ] Tests passing
- [ ] Email service configured
- [ ] Event publisher configured
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] Security headers added
- [ ] Logging configured
- [ ] Error tracking setup
- [ ] SSL/TLS enabled
- [ ] Backup strategy in place
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 🎓 Training & Onboarding

### For Developers

1. Read **Architecture Analysis** (.agent/IDENTITY_MODULE_ANALYSIS.md)
2. Review **Implementation Guide** (.agent/IMPLEMENTATION_GUIDE.md)
3. Study **Quick Reference** (.agent/QUICK_REFERENCE.md)
4. Run through API examples
5. Write a simple feature following the patterns

### For DevOps

1. Review deployment checklist
2. Setup production environment
3. Configure monitoring
4. Setup backup strategy
5. Create runbooks for common issues

---

## 🚨 Troubleshooting

### Common Issues

**"Cannot find module 'uuid'"**
```bash
pnpm install uuid @types/uuid
```

**"Prisma client not generated"**
```bash
pnpm prisma:generate
```

**"Database connection failed"**
- Check DATABASE_URL in .env
- Ensure MySQL is running
- Verify database exists

**"JWT token invalid"**
- Check JWT secrets match between registration and login
- Ensure secrets are at least 32 characters

---

## 📞 Support

- **Documentation**: `.agent/` directory
- **Examples**: See README.md
- **Architecture**: IDENTITY_MODULE_ANALYSIS.md

---

**Status**: ✅ Ready for Deployment  
**Next Action**: Run `pnpm install` to begin  
**Estimated Setup Time**: 15-30 minutes

---

*Last Updated: 2025-11-30*
