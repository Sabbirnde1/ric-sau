const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const home = await prisma.home.findFirst();
  if (home) {
    let hero = JSON.parse(home.hero);
    if (hero.title && hero.title.includes('Shahjalal')) {
      hero.title = hero.title.replace(/Shahjalal University of Science (&|and) Technology/ig, 'Sher-e-Bangla Agricultural University');
      hero.title = hero.title.replace(/Shahjalal University/ig, 'Sher-e-Bangla Agricultural University');
      await prisma.home.update({
        where: { id: home.id },
        data: { hero: JSON.stringify(hero) }
      });
      console.log('Updated Home hero title');
    }
  }

  const about = await prisma.about.findFirst();
  if (about) {
    let updated = false;
    let newHeroTitle = about.heroTitle;
    let newHeroSubtitle = about.heroSubtitle;
    if (newHeroTitle.includes('Shahjalal')) {
      newHeroTitle = newHeroTitle.replace(/Shahjalal University of Science (&|and) Technology/ig, 'Sher-e-Bangla Agricultural University');
      newHeroTitle = newHeroTitle.replace(/Shahjalal University/ig, 'Sher-e-Bangla Agricultural University');
      updated = true;
    }
    if (newHeroSubtitle.includes('Shahjalal')) {
      newHeroSubtitle = newHeroSubtitle.replace(/Shahjalal University of Science (&|and) Technology/ig, 'Sher-e-Bangla Agricultural University');
      newHeroSubtitle = newHeroSubtitle.replace(/Shahjalal University/ig, 'Sher-e-Bangla Agricultural University');
      updated = true;
    }
    if (updated) {
      await prisma.about.update({
        where: { id: about.id },
        data: { heroTitle: newHeroTitle, heroSubtitle: newHeroSubtitle }
      });
      console.log('Updated About data');
    }
  }
  
  console.log('Database check complete.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
