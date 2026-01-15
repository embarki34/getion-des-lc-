import { PrismaClient } from '../identity/infrastructure/persistence/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface SeedData {
  company: any;
  businessUnit: any;
  supplier: any;
  user: any;
  role: any;
  permission: any;
  banque: any[];
}

/**
 * Generate fake data for development and testing
 */
async function seed() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    // await clearData();

    const seedData: SeedData = {
      company: [],
      businessUnit: [],
      supplier: [],
      user: [],
      role: [],
      permission: [],
      banque: [],
    };

    // 1. Create Companies
    console.log('📦 Creating companies...');
    const company1 = await prisma.company.create({
      data: {
        name: 'Main Company SARL',
        code: 'MAIN',
        description: 'Main company for operations',
        address: '123 Main Street, Algiers, Algeria',
        contactInfo: 'contact@maincompany.dz',
        parentCompanyId: null,
        isActive: true,
      },
    });

    const company2 = await prisma.company.create({
      data: {
        name: 'Branch Office Oran',
        code: 'BRANCH_ORAN',
        description: 'Branch office in Oran',
        address: '456 Oran Street, Oran, Algeria',
        contactInfo: 'oran@maincompany.dz',
        parentCompanyId: company1.id,
        isActive: true,
      },
    });

    seedData.company = [company1, company2];
    console.log(`✅ Created ${seedData.company.length} companies`);

    // 2. Create Business Units
    console.log('\n🏢 Creating business units...');
    const bu1 = await prisma.businessUnit.create({
      data: {
        name: 'Sales Department',
        code: 'SALES',
        description: 'Sales and marketing',
        companyId: company1.id,
        isActive: true,
      },
    });

    const bu2 = await prisma.businessUnit.create({
      data: {
        name: 'Operations Department',
        code: 'OPS',
        description: 'Operations and logistics',
        companyId: company1.id,
        isActive: true,
      },
    });

    const bu3 = await prisma.businessUnit.create({
      data: {
        name: 'Finance Department',
        code: 'FINANCE',
        description: 'Finance and accounting',
        companyId: company2.id,
        isActive: true,
      },
    });

    seedData.businessUnit = [bu1, bu2, bu3];
    console.log(`✅ Created ${seedData.businessUnit.length} business units`);

    // 3. Create Suppliers
    console.log('\n🚚 Creating suppliers...');
    const suppliers = await Promise.all([
      prisma.supplier.create({
        data: {
          name: 'Supplier A Ltd',
          code: 'SUP001',
          description: 'Raw materials supplier',
          contactInfo: 'contact@suppliera.com',
          address: '789 Supplier Street, London, UK',
          isActive: true,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Supplier B Corp',
          code: 'SUP002',
          description: 'Equipment supplier',
          contactInfo: 'info@supplierb.com',
          address: '321 Equipment Avenue, Paris, France',
          isActive: true,
        },
      }),
      prisma.supplier.create({
        data: {
          name: 'Supplier C SARL',
          code: 'SUP003',
          description: 'Local supplier',
          contactInfo: 'contact@supplierc.dz',
          address: '654 Local Road, Algiers, Algeria',
          isActive: true,
        },
      }),
    ]);

    seedData.supplier = suppliers;
    console.log(`✅ Created ${seedData.supplier.length} suppliers`);

    // 4. Assign Suppliers to Companies
    console.log('\n🔗 Linking suppliers to companies...');
    await prisma.companySupplier.createMany({
      data: [
        { companyId: company1.id, supplierId: suppliers[0].id },
        { companyId: company1.id, supplierId: suppliers[1].id },
        { companyId: company2.id, supplierId: suppliers[2].id },
      ],
    });
    console.log('✅ Linked suppliers to companies');

    // 5. Assign Suppliers to Business Units
    await prisma.businessUnitSupplier.createMany({
      data: [
        { businessUnitId: bu1.id, supplierId: suppliers[0].id },
        { businessUnitId: bu2.id, supplierId: suppliers[1].id },
      ],
    });
    console.log('✅ Linked suppliers to business units');

    // 6. Create Banks
    console.log('\n🏦 Creating banks...');
    const banks = await Promise.all([
      prisma.banque.create({
        data: {
          nom: "Banque Nationale d'Algérie",
          codeSwift: 'BNAADZAL',
          adresse: '8 Bd Ernesto Che Guevara, Alger',
          contactInfo: '+213 21 71 47 19',
        },
      }),
      prisma.banque.create({
        data: {
          nom: 'Banque Extérieure d Algérie',
          codeSwift: 'BEXADZAL',
          adresse: '11 Boulevard Che Guevara, Alger',
          contactInfo: '+213 21 71 18 18',
        },
      }),
    ]);

    seedData.banque = banks;
    console.log(`✅ Created ${seedData.banque.length} banks`);

    // 7. Link Banks to Companies
    await prisma.companyBanque.createMany({
      data: [
        { companyId: company1.id, banqueId: banks[0].id },
        { companyId: company1.id, banqueId: banks[1].id },
        { companyId: company2.id, banqueId: banks[0].id },
      ],
    });
    console.log('✅ Linked banks to companies');

    // 8. Create Roles and Permissions
    console.log('\n🔐 Creating RBAC roles and permissions...');

    // Create Permissions
    const permissions = await Promise.all([
      prisma.permission.create({
        data: {
          name: 'Read Company',
          code: 'company:read:all',
          description: 'Read any company',
          resource: 'company',
          action: 'read',
          scope: 'all',
        },
      }),
      prisma.permission.create({
        data: {
          name: 'Create Company',
          code: 'company:create',
          description: 'Create new company',
          resource: 'company',
          action: 'create',
          scope: 'all',
        },
      }),
      prisma.permission.create({
        data: {
          name: 'Update Company',
          code: 'company:update',
          description: 'Update company',
          resource: 'company',
          action: 'update',
          scope: 'all',
        },
      }),
      prisma.permission.create({
        data: {
          name: 'Read User',
          code: 'user:read:all',
          description: 'Read any user',
          resource: 'user',
          action: 'read',
          scope: 'all',
        },
      }),
      prisma.permission.create({
        data: {
          name: 'Manage Roles',
          code: 'role:manage',
          description: 'Manage roles and permissions',
          resource: 'role',
          action: 'manage',
          scope: 'all',
        },
      }),
    ]);

    seedData.permission = permissions;
    console.log(`✅ Created ${seedData.permission.length} permissions`);

    // Create Roles
    const adminRole = await prisma.role.create({
      data: {
        name: 'Administrator',
        code: 'ADMIN',
        description: 'Full system access',
        isActive: true,
      },
    });

    const managerRole = await prisma.role.create({
      data: {
        name: 'Manager',
        code: 'MANAGER',
        description: 'Department manager',
        isActive: true,
      },
    });

    seedData.role = [adminRole, managerRole];
    console.log(`✅ Created ${seedData.role.length} roles`);

    // Assign Permissions to Roles
    await prisma.rolePermission.createMany({
      data: [
        // Admin gets all permissions
        { roleId: adminRole.id, permissionId: permissions[0].id },
        { roleId: adminRole.id, permissionId: permissions[1].id },
        { roleId: adminRole.id, permissionId: permissions[2].id },
        { roleId: adminRole.id, permissionId: permissions[3].id },
        { roleId: adminRole.id, permissionId: permissions[4].id },
        // Manager gets limited permissions
        { roleId: managerRole.id, permissionId: permissions[0].id },
        { roleId: managerRole.id, permissionId: permissions[3].id },
      ],
    });
    console.log('✅ Assigned permissions to roles');

    // 9. Create Users
    console.log('\n👥 Creating users...');
    const hashedPassword = await bcrypt.hash('Password123!', 10);

    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+213555000001',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        emailVerified: true,
        companyId: company1.id,
        businessUnitId: bu1.id,
      },
    });

    const managerUser = await prisma.user.create({
      data: {
        name: 'Manager User',
        email: 'manager@example.com',
        phone: '+213555000002',
        password: hashedPassword,
        role: 'user',
        status: 'active',
        emailVerified: true,
        companyId: company1.id,
        businessUnitId: bu2.id,
      },
    });

    const regularUser = await prisma.user.create({
      data: {
        name: 'Regular User',
        email: 'user@example.com',
        phone: '+213555000003',
        password: hashedPassword,
        role: 'user',
        status: 'active',
        emailVerified: true,
        companyId: company2.id,
        businessUnitId: bu3.id,
      },
    });

    seedData.user = [adminUser, managerUser, regularUser];
    console.log(`✅ Created ${seedData.user.length} users`);

    // Assign Roles to Users
    await prisma.userRole.createMany({
      data: [
        { userId: adminUser.id, roleId: adminRole.id, assignedBy: null },
        { userId: managerUser.id, roleId: managerRole.id, assignedBy: adminUser.id },
      ],
    });
    console.log('✅ Assigned roles to users');

    console.log('\n' + '='.repeat(60));
    console.log('✅ Seeding completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   - Companies: ${seedData.company.length}`);
    console.log(`   - Business Units: ${seedData.businessUnit.length}`);
    console.log(`   - Suppliers: ${seedData.supplier.length}`);
    console.log(`   - Banks: ${seedData.banque.length}`);
    console.log(`   - Roles: ${seedData.role.length}`);
    console.log(`   - Permissions: ${seedData.permission.length}`);
    console.log(`   - Users: ${seedData.user.length}`);
    console.log('\n🔑 Default login credentials:');
    console.log('   Admin: admin@example.com / Password123!');
    console.log('   Manager: manager@example.com / Password123!');
    console.log('   User: user@example.com / Password123!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Clear all data (use with caution!)
 */
async function clearData() {
  console.log('⚠️  Clearing existing data...');
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.companyBanque.deleteMany();
  await prisma.businessUnitSupplier.deleteMany();
  await prisma.companySupplier.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.businessUnit.deleteMany();
  await prisma.company.deleteMany();
  await prisma.banque.deleteMany();
  console.log('✅ Data cleared');
}

// Run seed
if (require.main === module) {
  seed().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export { seed, clearData };
