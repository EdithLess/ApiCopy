require("dotenv").config();
const express = require("express");

const jwt = require("jsonwebtoken");

const { Router } = require("express");

const cookiewJwtAuth = require("../routes/cookiewJwtAuth");
const { getUsers } = require("../db");

const router = Router();
const app = express();
app.use(express.json());

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login to get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login.
 *       403:
 *         description: Invalid login.
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Виклик функції для отримання всіх користувачів
    const users = await getUsers();

    // Пошук користувача за його іменем користувача (username)
    const user = users.find((user) => user.username === username);

    // Перевірка наявності користувача та збігу пароля
    if (!user || user.password !== password) {
      return res.status(403).json({ error: "Invalid login" });
    }

    // Видалення пароля з об'єкта користувача перед відправкою
    delete user.password;

    // Створення JWT-токена
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Встановлення токена в cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    // Повернення інформації про користувача
    return res.status(200).json(user);
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Check JWT and redirect to products
 *     responses:
 *       302:
 *         description: Redirects to products.
 */
router.post("/add", cookiewJwtAuth, (_req, res) => {
  res.redirect("/products");
});

module.exports = router;
