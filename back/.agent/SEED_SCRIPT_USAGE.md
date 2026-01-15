# Database Seeding Script

## Overview

The seed script generates fake data for development and testing purposes. It creates companies, business units, suppliers, banks, users, roles, and permissions.

## Usage

### Basic Usage

```bash
# Using ts-node
npx ts-node src/scripts/seed.ts

# Or add to package.json scripts
npm run seed
```

### Add to package.json

Add this script to your `package.json`:

```json
{
  "scripts": {
    "seed": "ts-node src/scripts/seed.ts",
    "seed:clear": "ts-node -e \"import('./src/scripts/seed').then(m => m.clearData())\""
  }
}
```

## What Gets Created

The seed script creates:

- **2 Companies** (1 main company, 1 branch)
- **3 Business Units** (Sales, Operations, Finance)
- **3 Suppliers**
- **2 Banks**
- **3 Roles** (Admin, Manager)
- **5 Permissions** (Various access permissions)
- **3 Users** (Admin, Manager, Regular user)
- **Relationships**: Supplier-Company, Supplier-BU, Bank-Company, User-Role, Role-Permission

## Default Credentials

After seeding, you can login with:

- **Admin**: `admin@example.com` / `Password123!`
- **Manager**: `manager@example.com` / `Password123!`
- **User**: `user@example.com` / `Password123!`

## Clearing Data

⚠️ **Warning**: This will delete ALL data from the database!

To clear all seeded data before re-seeding:

```typescript
// Uncomment the clearData() call in seed.ts
// Or create a separate script
```

## Customization

You can customize the seed data by editing `src/scripts/seed.ts`:

1. Modify company names, codes, addresses
2. Add more business units
3. Create additional suppliers
4. Add more roles and permissions
5. Create more test users

## Running Before Tests

You can use the seed script to prepare your database before running integration tests:

```bash
npm run seed && npm test
```

## Database Migration

Make sure your database is migrated before running the seed:

```bash
npm run migrate
npm run seed
```

## Example Output

```
🌱 Starting database seeding...

📦 Creating companies...
✅ Created 2 companies

🏢 Creating business units...
✅ Created 3 business units

🚚 Creating suppliers...
✅ Created 3 suppliers

🔗 Linking suppliers to companies...
✅ Linked suppliers to companies
✅ Linked suppliers to business units

🏦 Creating banks...
✅ Created 2 banks
✅ Linked banks to companies

🔐 Creating RBAC roles and permissions...
✅ Created 5 permissions
✅ Created 2 roles
✅ Assigned permissions to roles

👥 Creating users...
✅ Created 3 users
✅ Assigned roles to users

============================================================
✅ Seeding completed successfully!
============================================================

📊 Summary:
   - Companies: 2
   - Business Units: 3
   - Suppliers: 3
   - Banks: 2
   - Roles: 2
   - Permissions: 5
   - Users: 3

🔑 Default login credentials:
   Admin: admin@example.com / Password123!
   Manager: manager@example.com / Password123!
   User: user@example.com / Password123!
============================================================
```

## Troubleshooting

### Error: Table doesn't exist
- Make sure you've run migrations: `npm run migrate`

### Error: Unique constraint violation
- The script tries to create data that already exists
- Either clear the data first or modify the script to check for existing data

### Error: Foreign key constraint
- Make sure parent entities are created before child entities
- Check that referenced IDs exist

## Production Warning

⚠️ **NEVER run seed scripts in production!**

Seed scripts are for development and testing only. Production databases should be populated through proper application flows or controlled migrations.

