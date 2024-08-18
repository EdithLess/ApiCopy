require("dotenv").config()
const pg =require("pg")

const { Pool } = pg;
const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "bond007008",
    database: "E-shop",
    
})

pool.connect();

function getCategories() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM Categories`, (err, res) => {
            if (!err) {
                const result = res.rows;
                resolve(result);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function getProducts() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM "Products"`, (err, res) => {
            if (!err) {
                const result = res.rows;
                resolve(result);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function getProductById(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM "Products" WHERE id = $1`;
        const values = [id];

        pool.query(query, values, (err, res) => {
            if (!err) {
                if (res.rows.length > 0) {
                    resolve(res.rows[0]);
                } else {
                    resolve(null); // Якщо продукт з вказаним id не знайдено
                }
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function getCategorytById(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM "categories" WHERE id = $1`;
        const values = [id];

        pool.query(query, values, (err, res) => {
            if (!err) {
                if (res.rows.length > 0) {
                    resolve(res.rows[0]);
                } else {
                    resolve(null); // Якщо продукт з вказаним id не знайдено
                }
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function getUsers() {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM "users"`, (err, res) => {
            if (!err) {
                const result = res.rows;
                resolve(result);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function addProduct({ title, price, description, images, creationAt, updatedAt }) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO "Products" (title, price, description, images, "creationAt", "updatedAt")
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [title, price, description, images, creationAt, updatedAt];
        
        pool.query(query, values, (err, res) => {
            if (!err) {
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function addCategory({ name, image, creationAt, updatedAt }) {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO "categories" (name, image, "creationAt", "updatedAt")
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [name, image,creationAt, updatedAt ];
        
        pool.query(query, values, (err, res) => {
            if (!err) {
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function updateProductById(id, fieldsToUpdate) {
    return new Promise((resolve, reject) => {
        // Динамічно формуємо запит для оновлення на основі полів, які потрібно змінити
        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `"${key}" = $${index + 2}`)
            .join(', ');

        const query = `
            UPDATE "Products"
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id, ...Object.values(fieldsToUpdate)];

        pool.query(query, values, (err, res) => {
            if (!err) {
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function updateCategoryById(id, fieldsToUpdate) {
    return new Promise((resolve, reject) => {
        // Динамічно формуємо запит для оновлення на основі полів, які потрібно змінити
        const setClause = Object.keys(fieldsToUpdate)
            .map((key, index) => `"${key}" = $${index + 2}`)
            .join(', ');

        const query = `
            UPDATE "categories"
            SET ${setClause}
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id, ...Object.values(fieldsToUpdate)];

        pool.query(query, values, (err, res) => {
            if (!err) {
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}




function deleteProductById(id) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM "Products"
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];

        pool.query(query, values, (err, res) => {
            if (!err) {
                // Повертаємо видалений продукт, якщо знайдено і видалено
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

function deleteCategoryById(id) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM "categories"
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];

        pool.query(query, values, (err, res) => {
            if (!err) {
                // Повертаємо видалений продукт, якщо знайдено і видалено
                resolve(res.rows[0]);
            } else {
                console.log(err.message);
                reject(err);
            }
        });
    });
}

module.exports = {
    getCategories,
    getProducts,
    getProductById,
    getCategorytById,
    getUsers,
    addProduct,
    addCategory,
    updateProductById,
    updateCategoryById,
    deleteProductById,
    deleteCategoryById,
    pool
};
