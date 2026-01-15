import { PrismaClient } from '../persistence/prisma/client';
import { LEGACY_ROLE_MAPPING } from './roles.seed';

const prisma = new PrismaClient();

/**
 * Migration Script: Convert Legacy Roles to Dynamic RBAC
 * 
 * This script:
 * 1. Identifies users with legacy roles (user.role field)
 * 2. Maps them to new dynamic roles
 * 3. Creates UserRole assignments
 * 4. Maintains backward compatibility by keeping user.role field
 */
async function migrateRoles() {
    console.log('🔄 Starting role migration from legacy to RBAC...\n');

    try {
        // Step 1: Validate that roles exist
        console.log('1️⃣  Validating role data...');
        const rolesInDb = await prisma.role.findMany();

        if (rolesInDb.length === 0) {
            throw new Error('No roles found in database. Please run seed-rbac.ts first!');
        }

        console.log(`  ✅ Found ${rolesInDb.length} roles in database\n`);

        // Step 2: Get all users with their current roles
        console.log('2️⃣  Fetching users...');
        const users = await prisma.user.findMany({
            include: {
                userRoles: true,
            },
        });

        console.log(`  ✅ Found ${users.length} users\n`);

        // Step 3: Migrate each user
        console.log('3️⃣  Migrating users to new role system...');
        let migratedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const user of users) {
            try {
                // Check if user already has dynamic roles assigned
                if (user.userRoles.length > 0) {
                    console.log(`  ⏭️  User ${user.email} already has dynamic roles, skipping`);
                    skippedCount++;
                    continue;
                }

                // Map legacy role to new role code
                const legacyRole = user.role;
                const newRoleCode = LEGACY_ROLE_MAPPING[legacyRole] || 'READ_ONLY_USER';

                console.log(`  🔀 Migrating ${user.email}: ${legacyRole} -> ${newRoleCode}`);

                // Find the new role
                const newRole = await prisma.role.findUnique({
                    where: { code: newRoleCode },
                });

                if (!newRole) {
                    console.error(`    ❌ Role ${newRoleCode} not found!`);
                    errorCount++;
                    continue;
                }

                // Create UserRole assignment
                await prisma.userRole.create({
                    data: {
                        userId: user.id,
                        roleId: newRole.id,
                        companyId: user.companyId,
                        businessUnitId: user.businessUnitId,
                        assignedBy: null, // System migration
                    },
                });

                console.log(`    ✅ Assigned role ${newRoleCode} to ${user.email}`);
                migratedCount++;

            } catch (error) {
                console.error(`    ❌ Error migrating user ${user.email}:`, error);
                errorCount++;
            }
        }

        console.log('\n📊 Migration Summary:');
        console.log(`  - Total Users: ${users.length}`);
        console.log(`  - Migrated: ${migratedCount}`);
        console.log(`  - Skipped (already migrated): ${skippedCount}`);
        console.log(`  - Errors: ${errorCount}`);

        // Step 4: Verification
        console.log('\n4️⃣  Verifying migration...');
        const usersWithRoles = await prisma.user.findMany({
            where: {
                userRoles: {
                    some: {},
                },
            },
            include: {
                userRoles: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        console.log(`  ✅ ${usersWithRoles.length} users now have dynamic roles assigned`);

        // Display sample migrations
        console.log('\n📋 Sample Migrations:');
        usersWithRoles.slice(0, 5).forEach((user) => {
            const roleNames = user.userRoles.map(ur => ur.role.name).join(', ');
            console.log(`  - ${user.email}: ${roleNames}`);
        });

        console.log('\n✅ Role migration completed successfully!\n');

        // Step 5: Important Note
        console.log('⚠️  IMPORTANT NOTES:');
        console.log('  - Legacy user.role field has been kept for backward compatibility');
        console.log('  - Update authorization logic to use dynamic roles (UserRole table)');
        console.log('  - Remove hardcoded role checks from controllers');
        console.log('  - Test thoroughly before deploying to production\n');

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Add rollback function
async function rollbackMigration() {
    console.log('⏮️  Rolling back role migration...\n');

    try {
        const result = await prisma.userRole.deleteMany({
            where: {
                assignedBy: null, // Only delete system-migrated roles
            },
        });

        console.log(`✅ Rollback complete. Deleted ${result.count} role assignments.\n`);
    } catch (error) {
        console.error('❌ Rollback failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// CLI handling
const command = process.argv[2];

if (command === 'rollback') {
    rollbackMigration().catch((error) => {
        console.error('Failed to rollback:', error);
        process.exit(1);
    });
} else {
    migrateRoles().catch((error) => {
        console.error('Failed to migrate roles:', error);
        process.exit(1);
    });
}
