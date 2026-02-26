const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPass = await bcrypt.hash("admin123", 10);
  const vendedorPass = await bcrypt.hash("vendedor123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@minicrm.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@minicrm.com",
      password: adminPass,
      role: "admin",
    },
  });

  const vendedor = await prisma.user.upsert({
    where: { email: "vendedor@minicrm.com" },
    update: {},
    create: {
      name: "Maria Vendedora",
      email: "vendedor@minicrm.com",
      password: vendedorPass,
      role: "vendedor",
    },
  });

  const clients = [
    { name: "Maria Garcia", email: "maria@example.com", phone: "+52 55 1234 5678", company: "TechMX", pipeline: "cliente" },
    { name: "Carlos Lopez", email: "carlos@example.com", phone: "+52 33 9876 5432", company: "DataCorp", pipeline: "contactado" },
    { name: "Ana Martinez", email: "ana@example.com", phone: "+52 81 5555 1234", company: "StartupXYZ", pipeline: "prospecto" },
    { name: "Roberto Diaz", email: "roberto@example.com", phone: "+52 55 4321 8765", company: "MegaCorp", pipeline: "cliente" },
    { name: "Laura Sanchez", email: "laura@example.com", phone: "+52 33 1111 2222", company: "InnoTech", pipeline: "cerrado" },
  ];

  for (const c of clients) {
    const client = await prisma.client.upsert({
      where: { email: c.email },
      update: {},
      create: c,
    });

    await prisma.activity.create({
      data: {
        action: "created",
        details: `Cliente ${client.name} creado`,
        clientName: client.name,
        userId: admin.id,
        clientId: client.id,
      },
    });
  }

  console.log("Seed completado: 2 usuarios + 5 clientes");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
