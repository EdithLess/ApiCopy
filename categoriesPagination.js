const { sql } = require("@vercel/postgres");

async function getCategoriesPaginated(
  page = 0,
  categoriesPerPage = 5,
  name = null
) {
  const offset = page * categoriesPerPage;

  try {
    let categoriesResult;
    let countResult;

    if (name) {
      // Якщо параметр name існує, фільтруємо категорії за назвою
      categoriesResult = await sql`
        SELECT * FROM "Categories"
        WHERE name ILIKE ${"%" + name + "%"}
        ORDER BY id
        LIMIT ${categoriesPerPage}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) FROM "Categories"
        WHERE name ILIKE ${"%" + name + "%"}
      `;
    } else {
      // Якщо параметр name відсутній, показуємо всі категорії
      categoriesResult = await sql`
        SELECT * FROM "Categories"
        ORDER BY id
        LIMIT ${categoriesPerPage}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) FROM "Categories"
      `;
    }

    const categories = categoriesResult.rows;
    const totalCategories = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    return { categories, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

module.exports = { getCategoriesPaginated };
