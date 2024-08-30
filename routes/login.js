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
  const users = await getUsers();
  const user = users.find((user) => user.nickname === username);

  if (!user || user.password !== password) {
    return res.status(403).json({ error: "Invalid login" });
  }

  delete user.password;

  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
  });

  return res.status(200).json(user);
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
