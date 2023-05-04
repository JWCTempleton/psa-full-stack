const { pool } = require("../config");
// const jwt = require("jsonwebtoken");
const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();

router.get("/", async (req, res, next) => {
  try {
    const data = await pool.query("SELECT * FROM cards;");

    if (data.rowCount == 0) {
      return res.status(404).send("No card exists");
    }

    return res.status(200).json({
      status: 200,
      message: "All cards",
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
