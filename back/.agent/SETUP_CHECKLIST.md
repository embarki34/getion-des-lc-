# 📋 Setup Checklist

Follow this checklist to get your application running:

## ✅ Prerequisites

- [ ] Node.js >= 18 installed
- [ ] MySQL >= 8.0 installed and running
- [ ] npm or yarn installed
- [ ] Git installed (optional)

## ✅ Installation Steps

### 1. Dependencies
```bash
# You already ran this, but verify all packages are installed
npm install

# If you haven't run the dev dependencies install yet:
npm install --save-dev supertest @types/supertest eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 2. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your database credentials
# Required variables:
# - DATABASE_URL="mysql://user:password@localhost:3306/gestion_lc"
# - PORT=3000
# - NODE_ENV=development
```

### 3. Database Setup
```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run migrate

# (Optional) Open Prisma Studio to add initial data
npm run prisma:studio
```

### 4. Initial Data (Optional but Recommended)

Using Prisma Studio (http://localhost:5555), create:

**A. Create a Bank:**
- nom: "Banque Extérieure d'Algérie"
- codeSwift: "BARCDZAL"
- adresse: "Algiers, Algeria"
- contactInfo: "contact@bea.dz"

**B. Note the Bank ID** (you'll need it for creating credit lines)

### 5. Start the Application
```bash
# Start the credit line application
npm run dev:credit-line

# You should see:
# 🚀 Server running on port 3000
# 📊 Health check: http://localhost:3000/health
# 💳 Credit Lines API: http://localhost:3000/api/credit-lines
# 📨 SWIFT API: http://localhost:3000/api/swift
```

## ✅ Verification Steps

### 1. Health Check
```bash
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2024-..."}
```

### 2. Create a Credit Line
```bash
curl -X POST http://localhost:3000/api/credit-lines \
  -H "Content-Type: application/json" \
  -d '{
    "banqueId": "YOUR_BANK_ID_FROM_STEP_4",
    "montantPlafond": 1000000,
    "devise": "DZD",
    "dateDebut": "2024-01-01T00:00:00Z",
    "dateFin": "2025-12-31T23:59:59Z",
    "typeFinancement": "LC",
    "garanties": [
      {
        "type": "HYPOTHEQUE",
        "montant": 500000,
        "dateExpiration": "2025-12-31T00:00:00Z"
      }
    ]
  }'

# Expected response:
# {"id":"...","message":"Credit line created successfully"}
```

### 3. List Credit Lines
```bash
curl http://localhost:3000/api/credit-lines

# Expected: Array of credit lines
```

### 4. Generate SWIFT MT700
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
    "description": "ELECTRONIC COMPONENTS",
    "issuingBankSwift": "BARCDZAL"
  }'

# Expected response:
# {"id":"...","message":"SWIFT MT700 generated successfully"}
```

## ✅ Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- LigneDeCredit.test.ts
```

## ✅ Code Quality

### Linting
```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### Formatting
```bash
# Format all code
npm run format
```

## ✅ Development Tools

### Prisma Studio
```bash
# Open database GUI
npm run prisma:studio
# Opens at http://localhost:5555
```

### Database Migrations
```bash
# Create a new migration
npm run migrate

# Apply migrations (production)
npm run migrate:deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## ✅ Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
1. Check MySQL is running: `mysql -u root -p`
2. Verify DATABASE_URL in .env
3. Check database exists: `CREATE DATABASE gestion_lc;`

### Issue: "Prisma Client not found"
**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Port 3000 already in use"
**Solution:**
1. Change PORT in .env to 3001
2. Or kill process: `npx kill-port 3000`

### Issue: "Module not found"
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "TypeScript errors"
**Solution:**
```bash
npm run build
# Check for errors
```

## ✅ Next Steps After Setup

1. **Explore the Code**
   - Read `README_CREDIT_LINE.md` for architecture overview
   - Check `EXTENSION_GUIDE.md` to learn how to add features

2. **Add More Features**
   - Implement Avance sur Stock module
   - Implement Avance sur Facture module
   - Add authentication/authorization
   - Add more SWIFT message types

3. **Improve Testing**
   - Write more unit tests
   - Add integration tests
   - Add E2E tests

4. **Production Preparation**
   - Add Docker configuration
   - Setup CI/CD pipeline
   - Add monitoring and logging
   - Add API documentation (Swagger)

## ✅ Quick Reference

### Common Commands
```bash
npm run dev:credit-line    # Start development server
npm run prisma:studio      # Open database GUI
npm test                   # Run tests
npm run lint               # Check code quality
npm run format             # Format code
```

### Important URLs
- Application: http://localhost:3000
- Health Check: http://localhost:3000/health
- Prisma Studio: http://localhost:5555

### Important Files
- `.env` - Environment configuration
- `prisma/schema.prisma` - Database schema
- `src/app.ts` - Application entry point
- `README_CREDIT_LINE.md` - Main documentation
- `EXTENSION_GUIDE.md` - How to add features

## 🎉 You're All Set!

If all checkboxes are checked, your application is ready for development!

**Happy coding! 🚀**
