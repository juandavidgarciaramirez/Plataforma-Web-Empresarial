const { PrismaClient } = require('./prisma/generated');

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE schema_name IN (
      'audit',
      'careers',
      'catalog',
      'chat',
      'content',
      'core',
      'crm',
      'foundation',
      'pqr',
      'security'
    )
    ORDER BY schema_name
  `);

  console.table(result);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
