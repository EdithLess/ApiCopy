const { sql } = require("@vercel/postgres");

async function getCategoriesPaginated(
  page = 0,
  categoriesPerPage = 5,
  filters = {}
) {
  const { name = null, image = null, creationAt = null } = filters;
  const offset = page * categoriesPerPage;

  try {
    let query = `SELECT * FROM "Categories"`;
    let countQuery = `SELECT COUNT(*) FROM "Categories"`;
    let conditions = [];
    let params = [];

    if (name) {
      conditions.push(`name ILIKE $${params.length + 1}`);
      params.push(`%${name}%`);
    }
    if (image) {
      conditions.push(`image ILIKE $${params.length + 1}`);
      params.push(`%${image}%`);
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
    params.push(categoriesPerPage, offset);

    // console.log("Executing query:", query);
    // console.log("With parameters:", params);

    const categoriesResult = await sql.query(query, params);
    const countResult = await sql.query(countQuery, params.slice(0, -2)); // Видаляємо limit і offset

    // console.log("Categories result:", categoriesResult.rows);
    // console.log("Count result:", countResult.rows);

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
