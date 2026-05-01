import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting seeding...');

    const password = process.env.INITIAL_PASSWORD || 'ChangeMe123!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminEmail = 'admin@eventsync.com';

    console.log('👤 Creating or updating admin user...');

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            password: hashedPassword
        },
        create: {
            email: adminEmail,
            name: 'Admin EventSync',
            password: hashedPassword,
        },
    });

    console.log('✅ Admin user ready:', { id: admin.id, email: admin.email });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error('❌ Error during seeding:', e);
        await prisma.$disconnect();
        process.exit(1);
    });