import { prisma } from "../src/lib/prisma.js";
import { ORDER_STATUS } from "../src/domainmodel/orderStatusesEnum.js";
import { CATEGORIES } from "../src/domainmodel/categoriesEnum.js";

async function main() {
  for (const name of Object.values(ORDER_STATUS)) {

    await prisma.order_status.upsert({
      where: { name },
      update: {},
      create: { name },
    });

  }

  for (const name of CATEGORIES) {

    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

  }
}

main()
  .catch((error) => {

    console.error(error);
    process.exitCode = 1;

  })
  .finally(() => prisma.$disconnect());