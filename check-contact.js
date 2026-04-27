const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const contact = await prisma.contact.findFirst();

  if (contact) {
    await prisma.contact.update({
      where: { id: contact.id },
      data: { 
        address: '4th Floor, Central Library, Sher-e-Bangla Agricultural University, Dhaka-1207, Bangladesh',
        phone: '0244814019',
        email: 'info.sauric@gmail.com'
      }
    });
    console.log('Successfully updated the contact information in the database to the correct RIC-SAU details.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
