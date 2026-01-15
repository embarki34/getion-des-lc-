# Gestion des Lignes de Crédit - Backend API

## 🏗️ Architecture Overview

This backend application implements **Hexagonal Architecture + DDD + Clean Architecture + CQRS** for managing credit lines for Condor Electronics.

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│              (Express Controllers & Routes)                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│         (Commands, Queries, DTOs, Use Cases)                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN LAYER                             │
│    (Entities, Aggregates, Value Objects, Services)           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 INFRASTRUCTURE LAYER                         │
│      (Repositories, Database, SWIFT, File Storage)           │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── shared/                          # Shared kernel
│   ├── domain/
│   │   └── ddd.ts                  # Base DDD classes
│   ├── application/
│   │   ├── ICommand.ts             # CQRS Command interface
│   │   └── IQuery.ts               # CQRS Query interface
│   └── infrastructure/
│       ├── middleware/
│       │   ├── error.middleware.ts # Global error handler
│       │   └── validation.middleware.ts
│       └── validation/
│           └── schemas.ts          # Zod validation schemas
│
├── credit-line/                     # Credit Line Module
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── LigneDeCredit.ts   # Aggregate Root
│   │   │   └── Garantie.ts
│   │   ├── value-objects/
│   │   │   └── TypeDeFinancement.ts
│   │   └── repositories/
│   │       └── LigneDeCreditRepository.ts
│   ├── application/
│   │   ├── commands/
│   │   │   └── CreateCreditLineCommand.ts
│   │   ├── queries/
│   │   │   ├── ListCreditLinesQuery.ts
│   │   │   └── CalculateDisponibiliteQuery.ts
│   │   └── dto/
│   │       └── LigneDeCreditDTO.ts
│   └── infrastructure/
│       ├── controllers/
│       │   └── CreditLineController.ts
│       ├── repositories/
│       │   └── PrismaLigneDeCreditRepository.ts
│       ├── routes/
│       │   └── creditLine.routes.ts
│       └── config/
│           └── DIContainer.ts
│
├── bank-swift/                      # Bank & SWIFT Module
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── Banque.ts
│   │   │   └── SwiftMessage.ts
│   │   └── repositories/
│   │       ├── BanqueRepository.ts
│   │       └── SwiftMessageRepository.ts
│   ├── application/
│   │   ├── commands/
│   │   │   └── GenerateSwiftMT700Command.ts
│   │   └── dto/
│   │       └── SwiftMessageDTO.ts
│   └── infrastructure/
│       ├── controllers/
│       │   └── SwiftController.ts
│       ├── repositories/
│       │   └── PrismaSwiftMessageRepository.ts
│       ├── swift/
│       │   └── SwiftMT700Generator.ts
│       ├── routes/
│       │   └── swift.routes.ts
│       └── config/
│           └── DIContainer.ts
│
├── utilization/                     # Utilization & Encours Module
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Engagement.ts
│   │   └── repositories/
│   │       └── EngagementRepository.ts
│   └── infrastructure/
│       └── repositories/
│           └── PrismaEngagementRepository.ts
│
├── kpi/                            # KPI & Reporting Module
│   ├── domain/
│   │   └── services/
│   │       └── KPIService.ts
│   └── application/
│       └── queries/
│           ├── GetGlobalKPIsQuery.ts
│           └── CalculateAmortissementCMTQuery.ts
│
└── app.ts                          # Main application entry point

test/
├── unit/                           # Unit tests
│   ├── LigneDeCredit.test.ts
│   ├── KPIService.test.ts
│   └── SwiftMT700Generator.test.ts
└── integration/                    # Integration tests
    └── creditLine.integration.test.ts

prisma/
└── schema.prisma                   # Database schema
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- MySQL >= 8.0
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install additional packages (if not done manually)
npm install zod pino pino-pretty

# Setup environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run migrate
```

### Environment Variables

```env
DATABASE_URL="mysql://user:password@localhost:3306/gestion_lc"
PORT=3000
NODE_ENV=development
```

### Running the Application

```bash
# Development mode
npm run dev

# Run specific module
npm run dev:identity

# Run tests
npm test

# Run Prisma Studio
npm run prisma:studio
```

## 📊 Database Schema

The application uses the following main entities:

- **Banque**: Bank information with SWIFT codes
- **LigneDeCredit**: Credit line aggregate with plafond, dates, status
- **Garantie**: Guarantees associated with credit lines
- **Engagement**: Credit utilization records
- **SwiftMessage**: Generated SWIFT messages (MT700, MT707, MT734)
- **DocumentImport**: Uploaded documents (pro-forma, invoices, BL)

## 🔌 API Endpoints

### Credit Lines

```http
POST   /api/credit-lines              # Create credit line
GET    /api/credit-lines              # List all credit lines
GET    /api/credit-lines?banqueId=X   # Filter by bank
GET    /api/credit-lines/:id/disponibilite  # Calculate availability
```

### SWIFT Messages

```http
POST   /api/swift/mt700               # Generate MT700 message
```

### Health Check

```http
GET    /health                        # Application health status
```

## 📝 API Examples

### Create Credit Line

```bash
curl -X POST http://localhost:3000/api/credit-lines \
  -H "Content-Type: application/json" \
  -d '{
    "banqueId": "123e4567-e89b-12d3-a456-426614174000",
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
    "description": "ELECTRONIC COMPONENTS",
    "issuingBankSwift": "BARCDZAL"
  }'
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- test/unit

# Run integration tests only
npm test -- test/integration

# Run with coverage
npm test -- --coverage
```

## 🎯 Key Features Implemented

### ✅ Domain-Driven Design
- Aggregates: `LigneDeCredit`, `Banque`, `SwiftMessage`, `Engagement`
- Value Objects: `TypeDeFinancement`
- Domain Services: `KPIService`

### ✅ CQRS Pattern
- **Commands**: CreateCreditLineCommand, GenerateSwiftMT700Command
- **Queries**: ListCreditLinesQuery, CalculateDisponibiliteQuery, GetGlobalKPIsQuery

### ✅ Calculation Engines
- **Disponibilité**: `disponibilité = plafond - encours`
- **Interest**: `intérêts = encours × taux × (nb_jours / 360)`
- **CMT Amortization**: Full amortization table generation

### ✅ SWIFT Message Generation
- MT700 (Issue of Documentary Credit)
- Extensible for MT707, MT734

### ✅ Validation & Error Handling
- Zod schema validation
- Global error middleware with Pino logging
- Custom AppError class

### ✅ Repository Pattern
- Interface in domain layer
- Prisma implementation in infrastructure
- Easy to swap persistence layer

## 🔧 How to Extend the System

### Adding a New Use Case

1. **Create Command/Query** in `application/commands` or `application/queries`:

```typescript
// application/commands/UpdateCreditLineCommand.ts
export class UpdateCreditLineCommand implements ICommand {
  constructor(
    public readonly id: string,
    public readonly data: UpdateCreditLineDTO
  ) {}
}

export class UpdateCreditLineCommandHandler 
  implements ICommandHandler<UpdateCreditLineCommand, void> {
  
  constructor(private readonly repository: LigneDeCreditRepository) {}

  async execute(command: UpdateCreditLineCommand): Promise<void> {
    const ligne = await this.repository.findById(command.id);
    if (!ligne) throw new Error('Credit line not found');
    
    // Apply business logic
    ligne.modifierPlafond(command.data.nouveauPlafond);
    
    await this.repository.save(ligne);
  }
}
```

2. **Add to Controller**:

```typescript
async update(req: Request, res: Response, next: NextFunction) {
  try {
    const command = new UpdateCreditLineCommand(req.params.id, req.body);
    await this.updateHandler.execute(command);
    res.status(200).json({ message: 'Updated successfully' });
  } catch (error) {
    next(error);
  }
}
```

3. **Add Route**:

```typescript
router.put('/:id', validateRequest(UpdateSchema), controller.update.bind(controller));
```

### Adding a New Module

1. Create folder structure: `src/new-module/{domain,application,infrastructure}`
2. Define domain entities and repositories
3. Create use cases (commands/queries)
4. Implement infrastructure (controllers, repositories)
5. Create DI container
6. Register routes in `app.ts`

### Adding New SWIFT Message Type

1. Create generator in `bank-swift/infrastructure/swift/`:

```typescript
export class SwiftMT707Generator {
  generate(data: SwiftMT707DTO): string {
    // Implementation
  }
}
```

2. Create command handler
3. Add to SwiftController
4. Register route

## 🏆 Best Practices Implemented

- ✅ **Separation of Concerns**: Each layer has clear responsibilities
- ✅ **Dependency Inversion**: Domain doesn't depend on infrastructure
- ✅ **Single Responsibility**: Each class has one reason to change
- ✅ **Open/Closed**: Easy to extend without modifying existing code
- ✅ **Interface Segregation**: Small, focused interfaces
- ✅ **DRY**: Shared base classes and utilities
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Validation**: Input validation at API boundary
- ✅ **Error Handling**: Centralized error handling
- ✅ **Logging**: Structured logging with Pino
- ✅ **Testing**: Unit and integration test structure

## 📚 Additional Resources

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [SWIFT Standards](https://www.swift.com/standards/mt-standards)

## 🤝 Contributing

To add new features:

1. Follow the existing module structure
2. Write tests for new functionality
3. Update this documentation
4. Ensure all tests pass
5. Follow TypeScript and ESLint rules

## 📄 License

ISC
