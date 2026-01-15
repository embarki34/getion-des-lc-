# Quick Start Commands

## 🚀 First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database credentials

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Run database migrations
npm run migrate

# 5. Start the application
npm run dev:credit-line
```

## 📝 Common Commands

### Development

```bash
# Run credit line application
npm run dev:credit-line

# Run identity module (existing)
npm run dev:identity

# Run Prisma Studio (database GUI)
npm run prisma:studio
```

### Database

```bash
# Create and apply migration
npm run migrate

# Deploy migrations (production)
npm run migrate:deploy

# Generate Prisma Client
npm run prisma:generate

# Open Prisma Studio
npm run prisma:studio
```

### Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- LigneDeCredit.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## 🧪 Testing the API

### Health Check

```bash
curl http://localhost:3000/health
```

### Create a Bank

First, you'll need to create a bank in the database or use Prisma Studio.

### Create Credit Line

```bash
curl -X POST http://localhost:3000/api/credit-lines \
  -H "Content-Type: application/json" \
  -d '{
    "banqueId": "YOUR_BANK_ID",
    "montantPlafond": 1000000,
    "devise": "DZD",
    "dateDebut": "2024-01-01T00:00:00Z",
    "dateFin": "2025-12-31T23:59:59Z",
    "typeFinancement": "LC",
    "garanties": [
      {
        "type": "HYPOTHEQUE",
        "montant": 500000,
        "dateExpiration": "2025-12-31T00:00:00Z",
        "description": "Hypothèque sur bien immobilier"
      }
    ]
  }'
```

### List Credit Lines

```bash
curl http://localhost:3000/api/credit-lines
```

### Get Disponibilité

```bash
curl http://localhost:3000/api/credit-lines/YOUR_CREDIT_LINE_ID/disponibilite
```

### Generate SWIFT MT700

```bash
curl -X POST http://localhost:3000/api/swift/mt700 \
  -H "Content-Type: application/json" \
  -d '{
    "referenceDossier": "LC2024001",
    "applicantName": "CONDOR ELECTRONICS",
    "applicantAddress": "BORDJ BOU ARRERIDJ, ALGERIA",
    "beneficiaryName": "SAMSUNG ELECTRONICS",
    "beneficiaryAddress": "SEOUL, SOUTH KOREA",
    "amount": 500000,
    "currency": "USD",
    "expiryDate": "2024-12-31T00:00:00Z",
    "description": "ELECTRONIC COMPONENTS FOR MANUFACTURING",
    "issuingBankSwift": "BARCDZAL"
  }'
```

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check your .env file
cat .env

# Test database connection
npm run prisma:studio
```

### Prisma Client Not Found

```bash
# Regenerate Prisma Client
npm run prisma:generate
```

### Port Already in Use

```bash
# Change PORT in .env file
echo "PORT=3001" >> .env
```

### TypeScript Errors

```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📊 Using Prisma Studio

Prisma Studio provides a visual interface for your database:

```bash
npm run prisma:studio
```

Then open http://localhost:5555 in your browser.

You can:
- View all tables
- Add/edit/delete records
- Create test data
- Explore relationships

## 🔍 Viewing Logs

The application uses Pino for structured logging. Logs will show:
- Request details
- Errors with stack traces
- Database queries (in development)

Logs are colorized and formatted for easy reading in development mode.

## 📦 Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
npm start
```

## 🎯 Next Steps

1. ✅ Create initial bank records using Prisma Studio
2. ✅ Test creating credit lines via API
3. ✅ Generate SWIFT messages
4. ✅ Explore the codebase structure
5. ✅ Add new modules using EXTENSION_GUIDE.md
