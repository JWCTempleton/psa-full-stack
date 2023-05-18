const { pool } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();

router.post("/", async (req, res, next) => {
  const body = req.body;
  const query = "SELECT * FROM users WHERE username=$1;";
  const value = [body.username];

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) {
      return res.status(404).send("User does not exist");
    }
    const user = data.rows[0];

    console.log(user);

    const passwordCorrect = await bcrypt.compare(body.password, user.password);

    if (!passwordCorrect) {
      return response.status(401).json({
        error: "invalid username or password",
      });
    }

    if (user.disabled) {
      return response.status(401).json({
        error: "account disabled, please contact admin",
      });
    }

    const userForToken = {
      username: user.username,
      id: user.user_id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });

    return res
      .status(200)
      .send({
        token,
        username: user.username,
        name: user.name,
        admin: user.admin,
      });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
