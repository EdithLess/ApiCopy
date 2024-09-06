const { sql } = require("@vercel/postgres");

async function getCategoriesPaginated(page = 0, categoriesPerPage = 5) {
  const offset = page * categoriesPerPage;

  try {
    // Запит на отримання категорій з урахуванням пагінації
    const categoriesResult = await sql`
        SELECT * FROM "Categories"
        ORDER BY id
        LIMIT ${categoriesPerPage}
        OFFSET ${offset}
      `;
    const categories = categoriesResult.rows;

    // Запит на отримання загальної кількості категорій
    const countResult = await sql`
        SELECT COUNT(*) FROM "Categories"
      `;
    // Перетворення результату на число
    const totalCategories = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalCategories / categoriesPerPage);

    return { categories, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

module.exports = { getCategoriesPaginated };
