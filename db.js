require("dotenv").config()
const {sql} =require("@vercel/postgres")
const pg =require("pg")


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

// async function addUsers() {
//     try {
//       await sql`
//         CREATE TABLE IF NOT EXISTS "users" (
//           id SERIAL PRIMARY KEY,
//           username VARCHAR(255) NOT NULL,
//           password VARCHAR(255) NOT NULL,
//           creationAt TIMESTAMP NOT NULL)`;
//       console.log("Table created successfully");
//     } catch (error) {
//       console.error("Error creating table:", error);
//     }
//   }

//   addUsers()

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
      SELECT * FROM "Categories"
    `;

    // Виведення та повернення лише рядків з результату запиту
    const categories = result.rows;
    console.log("Categories:", categories);
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
    console.log("Products:", products);
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

// function getUsers() {
//     return new Promise((resolve, reject) => {
//         pool.query(`SELECT * FROM "users"`, (err, res) => {
//             if (!err) {
//                 const result = res.rows;
//                 resolve(result);
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

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
    console.log("Product added successfully:", newProduct);
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
}

async function addCategory({ name, image}) {
  try {
    // Додавання нового продукту в базу даних
    const result = await sql`
      INSERT INTO "Categories" (name, image, creationAt, updatedAt)
      VALUES (${name}, ${image}, NOW(), NOW())
      RETURNING *;
    `;

    // Повернення доданого продукту
    const newCategory = result.rows[0];
    console.log("Product added successfully:", newCategory);
    return newCategory;
  } catch (error) {
    console.error("Error adding category:", error);
    throw error;
  }
}

// function updateProductById(id, fieldsToUpdate) {
//     return new Promise((resolve, reject) => {
//         // Динамічно формуємо запит для оновлення на основі полів, які потрібно змінити
//         const setClause = Object.keys(fieldsToUpdate)
//             .map((key, index) => `"${key}" = $${index + 2}`)
//             .join(', ');

//         const query = `
//             UPDATE "Products"
//             SET ${setClause}
//             WHERE id = $1
//             RETURNING *;
//         `;
//         const values = [id, ...Object.values(fieldsToUpdate)];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 resolve(res.rows[0]);
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

// function updateCategoryById(id, fieldsToUpdate) {
//     return new Promise((resolve, reject) => {
//         // Динамічно формуємо запит для оновлення на основі полів, які потрібно змінити
//         const setClause = Object.keys(fieldsToUpdate)
//             .map((key, index) => `"${key}" = $${index + 2}`)
//             .join(', ');

//         const query = `
//             UPDATE "categories"
//             SET ${setClause}
//             WHERE id = $1
//             RETURNING *;
//         `;
//         const values = [id, ...Object.values(fieldsToUpdate)];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 resolve(res.rows[0]);
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }




// function deleteProductById(id) {
//     return new Promise((resolve, reject) => {
//         const query = `
//             DELETE FROM "Products"
//             WHERE id = $1
//             RETURNING *;
//         `;
//         const values = [id];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 // Повертаємо видалений продукт, якщо знайдено і видалено
//                 resolve(res.rows[0]);
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

// function deleteCategoryById(id) {
//     return new Promise((resolve, reject) => {
//         const query = `
//             DELETE FROM "categories"
//             WHERE id = $1
//             RETURNING *;
//         `;
//         const values = [id];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 // Повертаємо видалений продукт, якщо знайдено і видалено
//                 resolve(res.rows[0]);
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

module.exports = {
  getAllCategories,
  getAllProducts,
  getProductById,
  getCategoryById,
  addProduct,
addCategory
//     updateProductById,
//     updateCategoryById,
//     deleteProductById,
//     deleteCategoryById,
};
