require("dotenv").config();
const { sql } = require("@vercel/postgres");

// async function seedProducts() {
//     try {
//       await sql`
//         CREATE TABLE IF NOT EXISTS "Products" (
//           id SERIAL PRIMARY KEY,
//           title VARCHAR(255) NOT NULL,
//           price DECIMAL NOT NULL,
//           description TEXT NOT NULL,
//           images TEXT[] NOT NULL,
//           creationAt TIMESTAMP NOT NULL,
//           updatedAt TIMESTAMP NOT NULL)`;
//       console.log("Table created successfully");
//     } catch (error) {
//       console.error("Error creating table:", error);
//     }
//   }

// async function insertProducts() {
//   try {
//     // Замініть ці дані на ті, які хочете вставити
//     const title = "Classic Black Hooded Sweatshirt";
//     const price = 79
//     const description = "Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt. Made from high-quality, soft fabric that ensures comfort and durability."
//     const images =[
//     "https://i.imgur.com/cSytoSD.jpeg",
//             "https://i.imgur.com/WwKucXb.jpeg",
//             "https://i.imgur.com/cE2Dxh9.jpeg"
//   ]
//   const creationAt="2024-07-27T06:55:37.000Z"
//   const updatedAt="2024-07-27T06:55:37.000Z"

//     // Виконання запиту на вставку
//     await sql`
//       INSERT INTO "Products" (title, price, description, images, creationAt, updatedAt)
//       VALUES (${title}, ${price}, ${description}, ${images}, ${creationAt},${updatedAt})
//     `;
//     console.log("Category inserted successfully");
//   } catch (error) {
//     console.error("Error inserting category:", error);
//   }
// }

//   async function insertCategory() {
//     try {
//       // Замініть ці дані на ті, які хочете вставити
//       const name = "Electronics";
//       const image = "https://example.com/electronics.jpg";
//       const creationAt = new Date();
//       const updatedAt = new Date();

//       // Виконання запиту на вставку
//       await sql`
//         INSERT INTO "Categories" (name, image, creationAt, updatedAt)
//         VALUES (${name}, ${image}, ${creationAt}, ${updatedAt})
//       `;
//       console.log("Category inserted successfully");
//     } catch (error) {
//       console.error("Error inserting category:", error);
//     }
//   }

// const { Pool } = pg;
// const pool = new Pool({
//     host: "localhost",
//     user: "postgres",
//     port: 5432,
//     password: "bond007008",
//     database: "E-shop",

// })

// pool.connect();

async function getAllCategories() {
  try {
    // Виконання запиту на отримання всіх рядків з таблиці "Categories"
    const result = await sql`
      SELECT * FROM "categories"
    `;

    // Виведення та повернення лише рядків з результату запиту
    const categories = result.rows;
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function getAllProducts() {
  try {
    // Виконання запиту на отримання всіх рядків з таблиці "Categories"
    const result = await sql`
      SELECT * FROM "Products"
    `;

    // Виведення та повернення лише рядків з результату запиту
    const products = result.rows;
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

async function getProductById(id) {
  try {
    // Виконання запиту на отримання продукту за заданим id
    const result = await sql`
      SELECT * FROM "Products" WHERE id = ${id}
    `;

    // Виведення та повернення продукту
    const product = result.rows[0];
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
}

async function getCategoryById(id) {
  try {
    // Виконання запиту на отримання продукту за заданим id
    const result = await sql`
      SELECT * FROM "Categories" WHERE id = ${id}
    `;

    // Виведення та повернення продукту
    const category = result.rows[0];
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
}

async function addProduct({ title, price, description, images }) {
  try {
    // Додавання нового продукту в базу даних
    const result = await sql`
      INSERT INTO "Products" (title, price, description, images, creationAt, updatedAt)
      VALUES (${title}, ${price}, ${description}, ${images}, NOW(), NOW())
      RETURNING *;
    `;

    // Повернення доданого продукту
    const newProduct = result.rows[0];
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

async function addCategory({ name, image }) {
  try {
    // Додавання нового продукту в базу даних
    const result = await sql`
      INSERT INTO "Categories" (name, image, creationAt, updatedAt)
      VALUES (${name}, ${image}, NOW(), NOW())
      RETURNING *;
    `;

    // Повернення доданого продукту
    const newCategory = result.rows[0];
    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

async function updateProductById(id, fieldsToUpdate) {
  try {
    const setClause = Object.keys(fieldsToUpdate)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE "Products"
      SET ${setClause}, "updatedat" = NOW()
      WHERE id = $1
      RETURNING *;
    `;

    const values = [id, ...Object.values(fieldsToUpdate)];

    const result = await sql.query(query, values);

    const updatedProduct = result.rows[0];
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

async function updateCategoryById(id, fieldsToUpdate) {
  try {
    const setClause = Object.keys(fieldsToUpdate)
      .map((key, index) => `"${key}" = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE "Categories"
      SET ${setClause}, "updatedat" = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const values = [id, ...Object.values(fieldsToUpdate)];

    const result = await sql.query(query, values);

    const updatedCategory = result.rows[0];
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

async function deleteProductById(id) {
  try {
    // Виконання SQL-запиту для видалення продукту
    const result = await sql`
      DELETE FROM "Products"
      WHERE id = ${id}
      RETURNING *;
    `;

    // Повернення видаленого продукту (якщо такий був)
    const deletedProduct = result.rows[0];
    return deletedProduct;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
}

async function deleteCategoryById(id) {
  try {
    // Виконання SQL-запиту для видалення продукту
    const result = await sql`
      DELETE FROM "Categories"
      WHERE id = ${id}
      RETURNING *;
    `;

    // Повернення видаленого продукту (якщо такий був)
    const deletedCategory = result.rows[0];
    return deletedCategory;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}

async function getUsers() {
  try {
    // Виконання SQL-запиту для отримання всіх користувачів
    const result = await sql`
      SELECT * FROM "Users"
    `;

    // Виведення та повернення списку користувачів
    const users = result.rows;
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

module.exports = {
  getAllCategories,
  getAllProducts,
  getProductById,
  getCategoryById,
  addProduct,
  addCategory,
  updateProductById,
  updateCategoryById,
  deleteProductById,
  deleteCategoryById,
  getUsers,
};
