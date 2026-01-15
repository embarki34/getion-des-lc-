# Extension Guide - Adding New Modules

## 🎯 Quick Start: Adding a New Module

This guide shows you how to extend the system with new modules following the same architecture patterns.

## Example: Adding "Avance sur Stock" Module

### Step 1: Create Module Structure

```bash
mkdir -p src/avance-stock/{domain/{entities,repositories},application/{commands,queries,dto},infrastructure/{controllers,repositories,routes,config}}
```

### Step 2: Define Domain Entity

**File**: `src/avance-stock/domain/entities/AvanceSurStock.ts`

```typescript
import { AggregateRoot } from '../../../shared/domain/ddd';

export interface AvanceSurStockProps {
  ligneCreditId: string;
  numeroAvance: string;
  montant: number;
  devise: string;
  dateAvance: Date;
  dateEcheance: Date;
  statut: 'EN_COURS' | 'REMBOURSE' | 'ANNULE';
  descriptionMarchandise: string;
  valeurStock: number;
  tauxAvance: number; // Percentage
}

export class AvanceSurStock extends AggregateRoot<AvanceSurStockProps> {
  private constructor(props: AvanceSurStockProps, id?: string) {
    super(props, id);
  }

  public static create(props: AvanceSurStockProps, id?: string): AvanceSurStock {
    // Validation
    if (props.montant > props.valeurStock * (props.tauxAvance / 100)) {
      throw new Error('Montant exceeds allowed advance rate');
    }
    return new AvanceSurStock(props, id);
  }

  get montant(): number { return this.props.montant; }
  get statut(): string { return this.props.statut; }

  public rembourser(): void {
    if (this.props.statut !== 'EN_COURS') {
      throw new Error('Can only reimburse active advances');
    }
    this.props.statut = 'REMBOURSE';
  }
}
```

### Step 3: Define Repository Interface

**File**: `src/avance-stock/domain/repositories/AvanceSurStockRepository.ts`

```typescript
import { AvanceSurStock } from '../entities/AvanceSurStock';

export interface AvanceSurStockRepository {
  save(avance: AvanceSurStock): Promise<void>;
  findById(id: string): Promise<AvanceSurStock | null>;
  findByLigneCreditId(ligneId: string): Promise<AvanceSurStock[]>;
  findByStatut(statut: string): Promise<AvanceSurStock[]>;
}
```

### Step 4: Create DTOs

**File**: `src/avance-stock/application/dto/AvanceSurStockDTO.ts`

```typescript
export interface CreateAvanceSurStockDTO {
  ligneCreditId: string;
  numeroAvance: string;
  montant: number;
  devise: string;
  dateAvance: string;
  dateEcheance: string;
  descriptionMarchandise: string;
  valeurStock: number;
  tauxAvance: number;
}

export interface AvanceSurStockDTO {
  id: string;
  ligneCreditId: string;
  numeroAvance: string;
  montant: number;
  statut: string;
  dateAvance: string;
  dateEcheance: string;
}
```

### Step 5: Create Command

**File**: `src/avance-stock/application/commands/CreateAvanceSurStockCommand.ts`

```typescript
import { ICommand, ICommandHandler } from '../../../shared/application/ICommand';
import { AvanceSurStockRepository } from '../../domain/repositories/AvanceSurStockRepository';
import { AvanceSurStock } from '../../domain/entities/AvanceSurStock';
import { CreateAvanceSurStockDTO } from '../dto/AvanceSurStockDTO';

export class CreateAvanceSurStockCommand implements ICommand {
  constructor(public readonly data: CreateAvanceSurStockDTO) {}
}

export class CreateAvanceSurStockCommandHandler 
  implements ICommandHandler<CreateAvanceSurStockCommand, string> {
  
  constructor(private readonly repository: AvanceSurStockRepository) {}

  async execute(command: CreateAvanceSurStockCommand): Promise<string> {
    const avance = AvanceSurStock.create({
      ligneCreditId: command.data.ligneCreditId,
      numeroAvance: command.data.numeroAvance,
      montant: command.data.montant,
      devise: command.data.devise,
      dateAvance: new Date(command.data.dateAvance),
      dateEcheance: new Date(command.data.dateEcheance),
      statut: 'EN_COURS',
      descriptionMarchandise: command.data.descriptionMarchandise,
      valeurStock: command.data.valeurStock,
      tauxAvance: command.data.tauxAvance
    });

    await this.repository.save(avance);
    return avance.id;
  }
}
```

### Step 6: Add Prisma Schema

**File**: `prisma/schema.prisma` (add this model)

```prisma
model AvanceSurStock {
  id                      String    @id @default(uuid())
  ligneCreditId           String
  numeroAvance            String    @unique
  montant                 Float
  devise                  String
  dateAvance              DateTime
  dateEcheance            DateTime
  statut                  String    // EN_COURS, REMBOURSE, ANNULE
  descriptionMarchandise  String
  valeurStock             Float
  tauxAvance              Float
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  ligneCredit             LigneDeCredit @relation(fields: [ligneCreditId], references: [id])

  @@map("avances_sur_stock")
  @@index([ligneCreditId])
  @@index([statut])
  @@index([numeroAvance])
}
```

Then run:
```bash
npm run migrate
```

### Step 7: Implement Repository

**File**: `src/avance-stock/infrastructure/repositories/PrismaAvanceSurStockRepository.ts`

```typescript
import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { AvanceSurStockRepository } from '../../domain/repositories/AvanceSurStockRepository';
import { AvanceSurStock } from '../../domain/entities/AvanceSurStock';

export class PrismaAvanceSurStockRepository implements AvanceSurStockRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(avance: AvanceSurStock): Promise<void> {
    const props = avance['props'];
    
    await this.prisma.avanceSurStock.upsert({
      where: { id: avance.id },
      create: {
        id: avance.id,
        ligneCreditId: props.ligneCreditId,
        numeroAvance: props.numeroAvance,
        montant: props.montant,
        devise: props.devise,
        dateAvance: props.dateAvance,
        dateEcheance: props.dateEcheance,
        statut: props.statut,
        descriptionMarchandise: props.descriptionMarchandise,
        valeurStock: props.valeurStock,
        tauxAvance: props.tauxAvance
      },
      update: {
        statut: props.statut,
        montant: props.montant
      }
    });
  }

  async findById(id: string): Promise<AvanceSurStock | null> {
    const record = await this.prisma.avanceSurStock.findUnique({ where: { id } });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByLigneCreditId(ligneId: string): Promise<AvanceSurStock[]> {
    const records = await this.prisma.avanceSurStock.findMany({
      where: { ligneCreditId: ligneId }
    });
    return records.map(r => this.toDomain(r));
  }

  async findByStatut(statut: string): Promise<AvanceSurStock[]> {
    const records = await this.prisma.avanceSurStock.findMany({
      where: { statut }
    });
    return records.map(r => this.toDomain(r));
  }

  private toDomain(record: any): AvanceSurStock {
    return AvanceSurStock.create({
      ligneCreditId: record.ligneCreditId,
      numeroAvance: record.numeroAvance,
      montant: record.montant,
      devise: record.devise,
      dateAvance: record.dateAvance,
      dateEcheance: record.dateEcheance,
      statut: record.statut,
      descriptionMarchandise: record.descriptionMarchandise,
      valeurStock: record.valeurStock,
      tauxAvance: record.tauxAvance
    }, record.id);
  }
}
```

### Step 8: Create Controller

**File**: `src/avance-stock/infrastructure/controllers/AvanceSurStockController.ts`

```typescript
import { Request, Response, NextFunction } from 'express';
import { CreateAvanceSurStockCommandHandler } from '../../application/commands/CreateAvanceSurStockCommand';

export class AvanceSurStockController {
  constructor(
    private readonly createHandler: CreateAvanceSurStockCommandHandler
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { CreateAvanceSurStockCommand } = await import('../../application/commands/CreateAvanceSurStockCommand');
      const command = new CreateAvanceSurStockCommand(req.body);
      const id = await this.createHandler.execute(command);
      res.status(201).json({ id, message: 'Avance sur stock created successfully' });
    } catch (error) {
      next(error);
    }
  }
}
```

### Step 9: Create Routes

**File**: `src/avance-stock/infrastructure/routes/avanceSurStock.routes.ts`

```typescript
import { Router } from 'express';
import { AvanceSurStockController } from '../controllers/AvanceSurStockController';

export const createAvanceSurStockRoutes = (controller: AvanceSurStockController): Router => {
  const router = Router();

  router.post('/', controller.create.bind(controller));
  
  return router;
};
```

### Step 10: Create DI Container

**File**: `src/avance-stock/infrastructure/config/DIContainer.ts`

```typescript
import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';
import { PrismaAvanceSurStockRepository } from '../repositories/PrismaAvanceSurStockRepository';
import { CreateAvanceSurStockCommandHandler } from '../../application/commands/CreateAvanceSurStockCommand';
import { AvanceSurStockController } from '../controllers/AvanceSurStockController';

export class AvanceSurStockDIContainer {
  private static instance: AvanceSurStockDIContainer;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): AvanceSurStockDIContainer {
    if (!AvanceSurStockDIContainer.instance) {
      AvanceSurStockDIContainer.instance = new AvanceSurStockDIContainer();
    }
    return AvanceSurStockDIContainer.instance;
  }

  public getRepository() {
    return new PrismaAvanceSurStockRepository(this.prisma);
  }

  public getCreateHandler() {
    return new CreateAvanceSurStockCommandHandler(this.getRepository());
  }

  public getController() {
    return new AvanceSurStockController(this.getCreateHandler());
  }
}
```

### Step 11: Register in Main App

**File**: `src/app.ts` (add these lines)

```typescript
import { AvanceSurStockDIContainer } from './avance-stock/infrastructure/config/DIContainer';
import { createAvanceSurStockRoutes } from './avance-stock/infrastructure/routes/avanceSurStock.routes';

// In setupRoutes():
const avanceStockContainer = AvanceSurStockDIContainer.getInstance();
const avanceStockController = avanceStockContainer.getController();
this.app.use('/api/avance-stock', createAvanceSurStockRoutes(avanceStockController));
```

### Step 12: Add Validation Schema

**File**: `src/shared/infrastructure/validation/schemas.ts` (add)

```typescript
export const CreateAvanceSurStockSchema = z.object({
  ligneCreditId: z.string().uuid(),
  numeroAvance: z.string().min(1),
  montant: z.number().positive(),
  devise: z.string().length(3),
  dateAvance: z.string().datetime(),
  dateEcheance: z.string().datetime(),
  descriptionMarchandise: z.string().min(1),
  valeurStock: z.number().positive(),
  tauxAvance: z.number().min(0).max(100)
});
```

### Step 13: Write Tests

**File**: `test/unit/AvanceSurStock.test.ts`

```typescript
import { AvanceSurStock } from '../../../src/avance-stock/domain/entities/AvanceSurStock';

describe('AvanceSurStock Entity', () => {
  it('should create valid avance', () => {
    const avance = AvanceSurStock.create({
      ligneCreditId: 'ligne-123',
      numeroAvance: 'AVS-2024-001',
      montant: 400000,
      devise: 'DZD',
      dateAvance: new Date('2024-01-01'),
      dateEcheance: new Date('2024-12-31'),
      statut: 'EN_COURS',
      descriptionMarchandise: 'Electronic components',
      valeurStock: 500000,
      tauxAvance: 80
    });

    expect(avance.montant).toBe(400000);
  });

  it('should throw error if montant exceeds allowed rate', () => {
    expect(() => {
      AvanceSurStock.create({
        ligneCreditId: 'ligne-123',
        numeroAvance: 'AVS-2024-001',
        montant: 500000, // Exceeds 80% of 500000
        devise: 'DZD',
        dateAvance: new Date('2024-01-01'),
        dateEcheance: new Date('2024-12-31'),
        statut: 'EN_COURS',
        descriptionMarchandise: 'Electronic components',
        valeurStock: 500000,
        tauxAvance: 80
      });
    }).toThrow('Montant exceeds allowed advance rate');
  });
});
```

## 🎉 Done!

Your new module is now fully integrated. Test it:

```bash
curl -X POST http://localhost:3000/api/avance-stock \
  -H "Content-Type: application/json" \
  -d '{
    "ligneCreditId": "123e4567-e89b-12d3-a456-426614174000",
    "numeroAvance": "AVS-2024-001",
    "montant": 400000,
    "devise": "DZD",
    "dateAvance": "2024-01-01T00:00:00Z",
    "dateEcheance": "2024-12-31T00:00:00Z",
    "descriptionMarchandise": "Electronic components",
    "valeurStock": 500000,
    "tauxAvance": 80
  }'
```

## 📋 Checklist for New Modules

- [ ] Domain entities created
- [ ] Repository interfaces defined
- [ ] Commands/Queries implemented
- [ ] DTOs created
- [ ] Prisma schema updated
- [ ] Repository implementation done
- [ ] Controller created
- [ ] Routes defined
- [ ] DI Container configured
- [ ] Registered in main app
- [ ] Validation schemas added
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Documentation updated

## 🔄 Same Pattern for All Modules

Use this exact pattern for:
- ✅ Avance sur Facture
- ✅ Remise Documentaire
- ✅ CMT (Crédit Moyen Terme)
- ✅ Any future financing type

The architecture is designed to make adding new modules **fast, safe, and consistent**!
