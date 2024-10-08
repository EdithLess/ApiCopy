const { sql } = require("@vercel/postgres");

async function getProductsPaginated(
  page = 0,
  productsPerPage = 5,
  filters = {}
) {
  const {
    title = null,
    price = null,
    description = null,
    creationAt = null,
  } = filters;
  const offset = page * productsPerPage;

  try {
    let query = `SELECT * FROM "Products"`;
    let countQuery = `SELECT COUNT(*) FROM "Products"`;
    let conditions = [];
    let params = [];

    if (title) {
      conditions.push(`title ILIKE $${params.length + 1}`);
      params.push(`%${title}%`);
    }
    if (price) {
      conditions.push(`price = $${params.length + 1}`);
      params.push(price);
    }
    if (description) {
      conditions.push(`description ILIKE $${params.length + 1}`);
      params.push(`%${description}%`);
    }
    if (creationAt) {
      conditions.push(`creationAt::DATE = $${params.length + 1}`);
      params.push(creationAt.split("T")[0]); // Обрізаємо частину часу
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
      countQuery += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY id LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(productsPerPage, offset);

    // console.log("Executing query:", query);
    // console.log("With parameters:", params);

    const productsResult = await sql.query(query, params);
    const countResult = await sql.query(countQuery, params.slice(0, -2)); // Видаляємо limit і offset

    // console.log("products result:", productsResult.rows);
    // console.log("Count result:", countResult.rows);

    const products = productsResult.rows;
    const totalproducts = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalproducts / productsPerPage);

    return { products, totalPages, currentPage: page };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

module.exports = { getProductsPaginated };
