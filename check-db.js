const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const data = await prisma.content.findFirst({
    where: { type: 'home' }
  });
  console.log(JSON.stringify(data, null, 2));

  // Let's also check general settings
  const settings = await prisma.setting.findMany();
  console.log(JSON.stringify(settings, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
