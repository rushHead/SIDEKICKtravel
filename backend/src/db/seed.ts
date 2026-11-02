import 'dotenv/config';
import { db } from '../prisma/db';

export async function seedInitialAdmin() {
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@sidekicktravel.com';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSuperSecretPassword123!';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Root Administrator';

  console.log(`🔍 Checking for existing admin account (${adminEmail})...`);

  try {
    const existingAdmin = await db.orm.public.User
      .where({ email: adminEmail })
      .first();

    if (existingAdmin) {
      console.log(`ℹ️ Admin account (${adminEmail}) already exists. No action taken.`);
      return existingAdmin;
    }

    // Hash the initial password securely using Bun's native password hasher
    const hashedPassword = await Bun.password.hash(adminPassword, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    // Create the root admin record
    const createdAdmin = await db.orm.public.User.create({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'ADMIN',
      provider: 'EMAIL',
      isActive: true,
      createdById: null,
    });

    console.log(`✅ Initial Universal Admin successfully created!`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Role:  ADMIN`);
    console.log(`   ID:    ${createdAdmin.id}`);

    return createdAdmin;
  } catch (error) {
    console.error('❌ Failed to seed initial admin:', error);
    throw error;
  }
}

// If executed directly from CLI (e.g. `bun run src/db/seed.ts`)
if (import.meta.main) {
  seedInitialAdmin()
    .then(() => {
      console.log('🌱 Database seeding completed.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Database seeding failed:', err);
      process.exit(1);
    });
}
