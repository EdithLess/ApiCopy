require("dotenv").config()
const {sql} =require("@vercel/postgres")
const pg =require("pg")


async function seedProducts() {
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS "Products" (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price DECIMAL NOT NULL,
          description TEXT NOT NULL,
          images TEXT[] NOT NULL,
          creationAt TIMESTAMP NOT NULL,
          updatedAt TIMESTAMP NOT NULL)`;
      console.log("Table created successfully");
    } catch (error) {
      console.error("Error creating table:", error);
    }
  }

  async function insertCategory() {
    try {
      // Замініть ці дані на ті, які хочете вставити
      const name = "Electronics";
      const image = "https://example.com/electronics.jpg";
      const creationAt = new Date();
      const updatedAt = new Date();
  
      // Виконання запиту на вставку
      await sql`
        INSERT INTO "Categories" (name, image, creationAt, updatedAt)
        VALUES (${name}, ${image}, ${creationAt}, ${updatedAt})
      `;
      console.log("Category inserted successfully");
    } catch (error) {
      console.error("Error inserting category:", error);
    }
  }
  

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

// function getProducts() {
//     return new Promise((resolve, reject) => {
//         pool.query(`SELECT * FROM "Products"`, (err, res) => {
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

// function getProductById(id) {
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM "Products" WHERE id = $1`;
//         const values = [id];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 if (res.rows.length > 0) {
//                     resolve(res.rows[0]);
//                 } else {
//                     resolve(null); // Якщо продукт з вказаним id не знайдено
//                 }
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

// function getCategorytById(id) {
//     return new Promise((resolve, reject) => {
//         const query = `SELECT * FROM "categories" WHERE id = $1`;
//         const values = [id];

//         pool.query(query, values, (err, res) => {
//             if (!err) {
//                 if (res.rows.length > 0) {
//                     resolve(res.rows[0]);
//                 } else {
//                     resolve(null); // Якщо продукт з вказаним id не знайдено
//                 }
//             } else {
//                 console.log(err.message);
//                 reject(err);
//             }
//         });
//     });
// }

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

// function addProduct({ title, price, description, images, creationAt, updatedAt }) {
//     return new Promise((resolve, reject) => {
//         const query = `
//             INSERT INTO "Products" (title, price, description, images, "creationAt", "updatedAt")
//             VALUES ($1, $2, $3, $4, $5, $6)
//             RETURNING *;
//         `;
//         const values = [title, price, description, images, creationAt, updatedAt];
        
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

// function addCategory({ name, image, creationAt, updatedAt }) {
//     return new Promise((resolve, reject) => {
//         const query = `
//             INSERT INTO "categories" (name, image, "creationAt", "updatedAt")
//             VALUES ($1, $2, $3, $4)
//             RETURNING *;
//         `;
//         const values = [name, image,creationAt, updatedAt ];
        
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
  getAllCategories
//     getProducts,
//     getProductById,
//     getCategorytById,
//     getUsers,
//     addProduct,
//     addCategory,
//     updateProductById,
//     updateCategoryById,
//     deleteProductById,
//     deleteCategoryById,
};
