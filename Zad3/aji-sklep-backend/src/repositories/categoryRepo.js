import { Category } from "../domainmodel/category.js"
import { prisma } from "../lib/prisma.js"

function toCategory(row) {
    return new Category(row.category_id, row.name);
}

export async function getAll() {
    const rows = await prisma
    .category
    .findMany({ orderBy: { name: "asc" }});
    
    return rows.map(toCategory);
}