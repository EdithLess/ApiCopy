require("dotenv").config();
const { sql } = require("@vercel/postgres");
const express = require("express");
const jwt = require("jsonwebtoken");
const { Router } = require("express");
const { getUsers } = require("../source/db");

const router = Router();
const app = express();
app.use(express.json());

let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return refreshToken;
}

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
    const users = await getUsers();
    const user = users.find((user) => user.username === username);

    if (!user || user.password !== password) {
      return res.status(403).json({ error: "Invalid login" });
    }

    delete user.password;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("token", accessToken, { httpOnly: true });
    return res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ error: "Failed to log in" });
  }
});

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh JWT access token using refresh token
 *     responses:
 *       200:
 *         description: New access token generated.
 *       403:
 *         description: Invalid refresh token.
 */
router.post("/refresh", (req, res) => {
  const { token: refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token required" });
  }

  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ error: "Invalid refresh token" });
  }

  // Верифікуємо refreshToken
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid refresh token" });
    }

    // Генеруємо новий access token
    const accessToken = generateAccessToken({ username: user.username });

    res.json({ accessToken });
  });
});

router.post("/password", async (req, res) => {
  const { username, password, new_password } = req.body;
  try {
    const users = await getUsers();
    const user = users.find((user) => user.username === username);
    if (!user || user.password !== password) {
      return res.status(403).json({ error: "Invalid info" });
    }
    await sql`
    UPDATE "Users"
    SET "password"=${new_password}
    WHERE password = ${password}
  `;
    res.status(200).json({ message: "New password saved" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
