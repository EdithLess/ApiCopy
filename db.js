const { Client } = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "bond007008",
    database: "E-shop"
});

client.connect();

function getCategories() {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM Categories`, (err, res) => {
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
        client.query(`SELECT * FROM "Products"`, (err, res) => {
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

function getUsers() {
    return new Promise((resolve, reject) => {
        client.query(`SELECT * FROM "users"`, (err, res) => {
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
        
        client.query(query, values, (err, res) => {
            if (!err) {
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
    getUsers,
    addProduct
};
