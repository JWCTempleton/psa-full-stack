const { pool } = require("../config");
// const jwt = require("jsonwebtoken");
const router = require("express").Router();
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

router.get("/", async (req, res, next) => {
  try {
    const data = await pool.query(
      "SELECT user_id, username, name, admin FROM users;"
    );

    if (data.rowCount == 0) {
      return res.status(404).send("No user exists");
    }

    return res.status(200).json({
      status: 200,
      message: "All users",
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { username, name, password } = req.body;
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const query =
    "INSERT INTO users(username, password, name) VALUES($1, $2, $3) RETURNING *;";
  const values = [username, passwordHash, name];

  try {
    const data = await pool.query(query, values);

    return res.status(201).json({
      status: 201,
      message: "User added successfully",
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
