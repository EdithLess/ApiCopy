const { sql } = require("@vercel/postgres");

async function getProductsPaginated(page = 0, productsPerPage = 5) {
  const offset = page * productsPerPage;

  try {
    // Запит на отримання категорій з урахуванням пагінації
    const productsResult = await sql`
        SELECT * FROM "Products"
        ORDER BY id
        LIMIT ${productsPerPage}
        OFFSET ${offset}
      `;
    const products = productsResult.rows;

    // Запит на отримання загальної кількості категорій
    const countResult = await sql`
        SELECT COUNT(*) FROM "Categories"
      `;
    // Перетворення результату на число
    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

module.exports = { getProductsPaginated };
