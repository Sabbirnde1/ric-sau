const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('testing');
  const count = await prisma.team.count();
  console.log('Team members:', count);
}
main().catch(console.error).finally(() => prisma.$disconnect());
