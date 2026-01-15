import { PrismaClient } from '../persistence/prisma/client';
import * as bcrypt from 'bcryptjs';
import { PERMISSIONS } from './permissions.seed';
import { ROLES } from './roles.seed';

const prisma = new PrismaClient();

/**
 * Seed Permissions and Roles into the database
 * This script populates the initial RBAC configuration
 */
async function seedDatabase() {
    console.log('🌱 Starting RBAC database seeding...\n');

    try {
        // Step 1: Seed Permissions
        console.log('📋 Seeding permissions...');
        let permissionCount = 0;
        const permissionMap = new Map<string, string>(); // code -> id

        for (const perm of PERMISSIONS) {
            const existing = await prisma.permission.findUnique({
                where: { code: perm.code },
            });

            if (existing) {
                console.log(`  ⏭️  Permission already exists: ${perm.code}`);
                permissionMap.set(perm.code, existing.id);
            } else {
                const created = await prisma.permission.create({
                    data: {
                        name: perm.name,
                        code: perm.code,
                        description: perm.description,
                        resource: perm.resource,
                        action: perm.action,
                        scope: perm.scope,
                    },
                });
                permissionMap.set(perm.code, created.id);
                console.log(`  ✅ Created permission: ${perm.code}`);
                permissionCount++;
            }
        }

        console.log(`\n✨ Permissions seeded: ${permissionCount} new, ${PERMISSIONS.length - permissionCount} existing\n`);

        // Step 2: Seed Roles
        console.log('👥 Seeding roles...');
        let roleCount = 0;

        for (const role of ROLES) {
            const existing = await prisma.role.findUnique({
                where: { code: role.code },
            });

            let roleId: string;

            if (existing) {
                console.log(`  ⏭️  Role already exists: ${role.code}`);
                roleId = existing.id;

                // Update role details if needed
                await prisma.role.update({
                    where: { id: roleId },
                    data: {
                        name: role.name,
                        description: role.description,
                        isActive: role.isActive,
                    },
                });
            } else {
                const created = await prisma.role.create({
                    data: {
                        name: role.name,
                        code: role.code,
                        description: role.description,
                        isActive: role.isActive,
                    },
                });
                roleId = created.id;
                console.log(`  ✅ Created role: ${role.code}`);
                roleCount++;
            }

            // Step 3: Assign Permissions to Roles
            console.log(`  🔗 Assigning permissions to ${role.code}...`);
            let assignedCount = 0;

            for (const permCode of role.permissions) {
                const permId = permissionMap.get(permCode);

                if (!permId) {
                    console.warn(`    ⚠️  Permission not found: ${permCode}`);
                    continue;
                }

                const existingAssignment = await prisma.rolePermission.findUnique({
                    where: {
                        roleId_permissionId: {
                            roleId: roleId,
                            permissionId: permId,
                        },
                    },
                });

                if (!existingAssignment) {
                    await prisma.rolePermission.create({
                        data: {
                            roleId: roleId,
                            permissionId: permId,
                        },
                    });
                    assignedCount++;
                }
            }

            console.log(`    ✅ Assigned ${assignedCount} new permissions to ${role.code}`);
        }

        console.log(`\n✨ Roles seeded: ${roleCount} new, ${ROLES.length - roleCount} existing\n`);

        // Step 4: Summary
        console.log('📊 Seeding Summary:');
        console.log(`  - Total Permissions: ${PERMISSIONS.length}`);
        console.log(`  - Total Roles: ${ROLES.length}`);
        console.log(`  - New Permissions: ${permissionCount}`);
        console.log(`  - New Roles: ${roleCount}`);

        const totalAssignments = await prisma.rolePermission.count();
        console.log(`  - Total Role-Permission Assignments: ${totalAssignments}`);

        // Step 5: Seed Admin User
        console.log('\n👤 Seeding Admin User...');
        const adminEmail = 'admin@system.local';
        const existingAdmin = await prisma.user.findUnique({
            where: { email: adminEmail }
        });

        if (existingAdmin) {
            console.log(`  ⏭️  Admin user already exists: ${adminEmail}`);
        } else {
            const hashedPassword = await bcrypt.hash('Admin123!', 10);
            const superAdminRole = await prisma.role.findUnique({ where: { code: 'SUPER_ADMIN' } });

            if (!superAdminRole) {
                throw new Error('SUPER_ADMIN role not found. Cannot create admin user.');
            }

            const adminUser = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'System Administrator',
                    status: 'active',
                    emailVerified: true,
                    role: 'admin', // Legacy field
                    userRoles: {
                        create: {
                            roleId: superAdminRole.id
                        }
                    }
                }
            });
            console.log('  ✅ Created Admin User:');
            console.log(`     Email: ${adminEmail}`);
            console.log(`     Password: Admin123!`);
            console.log(`     Role: SUPER_ADMIN`);
        }

        console.log('\n✅ RBAC database seeding completed successfully!\n');

    } catch (error) {
        console.error('\n❌ Error seeding database:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the seeder
seedDatabase()
    .catch((error) => {
        console.error('Failed to seed database:', error);
        process.exit(1);
    });
