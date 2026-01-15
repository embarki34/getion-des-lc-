# Multi-Company Architecture with RBAC - Implementation Guide

## Executive Summary

This document provides a comprehensive guide to the multi-company architecture implementation with business units, supplier relations, and dynamic RBAC system that has been added to the Gestion-LC project.

## Architecture Overview

The implementation follows the existing **Hexagonal Architecture** and **Domain-Driven Design** patterns used throughout the project:

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  (Commands, Queries, DTOs, Use Cases)                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      Domain Layer                            │
│  (Entities, Value Objects, Domain Services, Repositories)   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  (Prisma Repositories, Controllers, Routes, DI Containers)  │
└─────────────────────────────────────────────────────────────┘
```

## 1. Company Structure & Hierarchy

### Domain Model

```
Company
├── Can have multiple sub-companies (branches)
├── Can have multiple Business Units
├── Can have multiple Suppliers (many-to-many)
└── Can have multiple Banks (many-to-many)

BusinessUnit
├── Belongs to one Company
└── Can have multiple Suppliers (many-to-many)
```

### Key Features

1. **Hierarchical Company Structure**
   - Companies can have parent companies (branches)
   - Circular references are prevented
   - Root companies have `parentCompanyId = null`

2. **Business Units**
   - Each business unit belongs to exactly one company
   - Code is unique within a company (composite unique key)
   - Can be reassigned to different companies

3. **Supplier Relations**
   - Many-to-many at both company and business unit levels
   - Independent assignment allows granular control

### Files Created

**Domain Layer:**
- `src/company/domain/entities/Company.ts`
- `src/company/domain/entities/BusinessUnit.ts`
- `src/company/domain/entities/Supplier.ts`
- `src/company/domain/repositories/*.ts` (6 repository interfaces)

**Application Layer:**
- `src/company/application/dto/*.ts` (3 DTO files)
- `src/company/application/commands/*.ts` (10 command files)
- `src/company/application/queries/*.ts` (6 query files)

**Infrastructure Layer:**
- `src/company/infrastructure/repositories/*.ts` (6 Prisma implementations)
- `src/company/infrastructure/controllers/CompanyController.ts`
- `src/company/infrastructure/config/DIContainer.ts`
- `src/company/infrastructure/routes/company.routes.ts`

## 2. RBAC System

### Architecture

The RBAC system is integrated into the Identity module and supports:

1. **Roles** - Named collections of permissions
2. **Permissions** - Fine-grained access control with scoping
3. **User-Role Assignments** - Many-to-many with optional scoping
4. **Role-Permission Assignments** - Many-to-many relationships

### Permission Scoping

Permissions support four scopes:

- **`all`** - Full access across all resources
- **`own`** - Access only to resources owned by the user
- **`company`** - Access limited to user's company
- **`business-unit`** - Access limited to user's business unit

### Files Created

**Domain Layer:**
- `src/identity/domain/entities/Role.ts`
- `src/identity/domain/entities/Permission.ts`
- `src/identity/domain/repositories/IRoleRepository.ts`
- `src/identity/domain/repositories/IPermissionRepository.ts`
- `src/identity/domain/repositories/IUserRoleRepository.ts`
- `src/identity/domain/repositories/IRolePermissionRepository.ts`
- `src/identity/domain/services/IRbacService.ts`

**Infrastructure Layer:**
- `src/identity/infrastructure/services/RbacService.ts`

## 3. Database Schema

### New Tables

```sql
-- Company Structure
Company (id, name, code, description, address, contactInfo, parentCompanyId, isActive, ...)
BusinessUnit (id, name, code, description, companyId, isActive, ...)
Supplier (id, name, code, description, contactInfo, address, isActive, ...)

-- Many-to-Many Relationships
CompanySupplier (id, companyId, supplierId, createdAt)
BusinessUnitSupplier (id, businessUnitId, supplierId, createdAt)
CompanyBanque (id, companyId, banqueId, createdAt)

-- RBAC Tables
Role (id, name, code, description, isActive, ...)
Permission (id, name, code, description, resource, action, scope, ...)
UserRole (id, userId, roleId, companyId, businessUnitId, assignedAt, assignedBy)
RolePermission (id, roleId, permissionId, createdAt)
```

### Updated Tables

- `user` - Added `companyId` and `businessUnitId` fields
- `Banque` - Added relationship to companies via `CompanyBanque`

## 4. Implementation Status

### ✅ Completed

1. **Prisma Schema** - All models and relationships defined
2. **Company Module Domain Layer** - All entities and repository interfaces
3. **Company Module Application Layer** - All commands and queries
4. **Company Module Infrastructure** - All Prisma repositories
5. **RBAC Domain Layer** - Entities and service interface
6. **RBAC Service** - Permission checking logic
7. **Company Controller** - Basic CRUD operations
8. **Company Routes** - Route definitions
9. **DI Container** - Company module dependency injection

### 🔄 Remaining Work

#### A. RBAC Infrastructure (High Priority)

1. **Prisma Repository Implementations**
   - [ ] `PrismaRoleRepository`
   - [ ] `PrismaPermissionRepository`
   - [ ] `PrismaUserRoleRepository`
   - [ ] `PrismaRolePermissionRepository`

2. **RBAC Commands & Queries**
   - [ ] Create/Update/Delete Role commands
   - [ ] Create/Update/Delete Permission commands
   - [ ] Assign/Remove Role to User commands
   - [ ] Assign/Remove Permission to Role commands
   - [ ] Query handlers for roles and permissions

3. **RBAC Controllers**
   - [ ] RoleController
   - [ ] PermissionController
   - [ ] UserRoleController

4. **RBAC Middleware**
   - [ ] PermissionMiddleware for route protection
   - [ ] Integration with existing AuthenticationMiddleware

#### B. Complete Company Module (Medium Priority)

1. **Controllers**
   - [ ] BusinessUnitController
   - [ ] SupplierController
   - [ ] Add assignment endpoints to CompanyController

2. **Routes**
   - [ ] Business unit routes
   - [ ] Supplier routes
   - [ ] Assignment routes (supplier, banque)

#### C. Integration (High Priority)

1. **Main Application**
   - [ ] Update `src/app.ts` to register company routes
   - [ ] Update Identity DI container with RBAC repositories
   - [ ] Create seed data for roles and permissions

2. **User Module Updates**
   - [ ] Update user creation/update to support company/BU assignment
   - [ ] Add endpoints for user role assignment

## 5. Next Steps

### Step 1: Run Database Migration

```bash
# Review the schema changes
cat prisma/schema.prisma

# Create and apply migration
npm run migrate
# Or manually:
npx prisma migrate dev --name add_multi_company_rbac

# Generate Prisma client
npm run prisma:generate
```

### Step 2: Complete RBAC Infrastructure

1. Create Prisma repositories for RBAC entities
2. Implement commands/queries for role/permission management
3. Create controllers and routes
4. Implement PermissionMiddleware

### Step 3: Complete Company Module

1. Create remaining controllers (BusinessUnit, Supplier)
2. Create route files for all entities
3. Add assignment endpoints

### Step 4: Integration

1. Register company routes in `src/app.ts`
2. Update Identity DI container
3. Create seed data for initial roles/permissions
4. Test the complete flow

### Step 5: Testing

1. Unit tests for domain entities
2. Integration tests for API endpoints
3. RBAC permission tests
4. End-to-end tests for multi-company scenarios

## 6. Usage Examples

### Creating a Company

```typescript
POST /api/v1/companies
{
  "name": "Main Company",
  "code": "MAIN",
  "description": "Main company description",
  "address": "123 Main St",
  "contactInfo": "contact@main.com",
  "parentCompanyId": null,  // Root company
  "isActive": true
}
```

### Creating a Branch

```typescript
POST /api/v1/companies
{
  "name": "Branch Office",
  "code": "BRANCH",
  "parentCompanyId": "<main-company-id>",  // Link to parent
  "isActive": true
}
```

### Assigning Supplier to Company

```typescript
POST /api/v1/companies/{companyId}/suppliers
{
  "supplierId": "<supplier-id>"
}
```

### RBAC Permission Check (in middleware)

```typescript
// Check if user has permission
const hasPermission = await rbacService.hasPermission(
  userId,
  'company:read:all',
  { companyId: userCompanyId }
);
```

## 7. Design Patterns Used

1. **Repository Pattern** - Abstraction over data access
2. **Command Query Responsibility Segregation (CQRS)** - Separate commands and queries
3. **Dependency Injection** - DI containers for each module
4. **Aggregate Root** - Domain entities extend AggregateRoot
5. **Value Objects** - Immutable domain concepts
6. **Domain Services** - Business logic services

## 8. Important Notes

1. **Circular Reference Prevention**: The `UpdateCompanyCommand` includes logic to prevent circular references in company hierarchy

2. **Cascade Deletion**: Business units are cascade deleted when a company is deleted. Sub-companies cannot be deleted if they have children.

3. **Unique Constraints**: 
   - Company codes must be unique globally
   - Business unit codes must be unique within a company
   - Supplier codes must be unique globally

4. **RBAC Scoping**: User-role assignments can be scoped to specific companies/business units, allowing role inheritance and overrides

5. **Prisma Client**: The Prisma client is generated in `src/identity/infrastructure/persistence/prisma/client` and shared across modules

## 9. File Locations Reference

### Company Module
- Domain: `src/company/domain/`
- Application: `src/company/application/`
- Infrastructure: `src/company/infrastructure/`

### RBAC System
- Domain: `src/identity/domain/entities/Role.ts`, `Permission.ts`
- Domain Services: `src/identity/domain/services/IRbacService.ts`
- Infrastructure: `src/identity/infrastructure/services/RbacService.ts`

### Database Schema
- Schema: `prisma/schema.prisma`
- Generated Client: `src/identity/infrastructure/persistence/prisma/client/`

## 10. Support & Documentation

For questions or issues:
1. Review `IMPLEMENTATION_STATUS.md` for detailed status
2. Check existing patterns in `bank-swift` or `credit-line` modules
3. Refer to `ARCHITECTURE.md` for architectural principles

---

**Last Updated**: Initial implementation
**Status**: Core architecture complete, RBAC infrastructure pending

