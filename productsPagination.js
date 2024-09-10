const { sql } = require("@vercel/postgres");

async function getProductsPaginated(
  page = 0,
  productsPerPage = 2,
  title = null
) {
  const offset = page * productsPerPage;

  try {
    let productsResult;
    let countResult;

    if (title) {
      // Якщо параметр title існує, фільтруємо категорії за назвою
      productsResult = await sql`
        SELECT * FROM "Products"
        WHERE title ILIKE ${"%" + title + "%"}
        ORDER BY id
        LIMIT ${productsPerPage}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) FROM "Products"
        WHERE title ILIKE ${"%" + title + "%"}
      `;
    } else {
      // Якщо параметр title відсутній, показуємо всі категорії
      productsResult = await sql`
        SELECT * FROM "Products"
        ORDER BY id
        LIMIT ${productsPerPage}
        OFFSET ${offset}
      `;

      countResult = await sql`
        SELECT COUNT(*) FROM "Products"
      `;
    }

    const products = productsResult.rows;
    const totalProducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

module.exports = { getProductsPaginated };
