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


module.exports = {
    getCategories,
    getProducts,
    getUsers
};
