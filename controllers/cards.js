const { pool } = require("../config");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const dotenv = require("dotenv");
dotenv.config();

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNjgzMzM2OTY2LCJleHAiOjE2ODMzNDA1NjZ9.C0W-d1jhpALmH5MY6PqUE1tHHFpE8_MYc2vyRyAyrU0

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(
        authorization.substring(7),
        process.env.SECRET
      );
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.get("/", async (req, res, next) => {
  try {
    const data = await pool.query(
      "SELECT c.*, u.user_id, u.username FROM cards c JOIN users u on c.user_id=u.user_id;"
    );

    if (data.rowCount == 0) {
      return res.status(404).send("No card exists");
    }

    const returnedValue = [];
    data.rows.map((card) => {
      returnedValue.push({
        id: card.card_id,
        company: card.company,
        description: card.description,
        notes: card.notes,
        status: card.status,
        created_at: card.created_at,
        user: {
          user_id: card.user_id,
          username: card.username,
        },
      });
    });
    return res.status(200).json({
      status: 200,
      message: "All cards",
      data: returnedValue,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const query = "SELECT * FROM cards WHERE card_id=$1";
  const value = [id];

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) {
      return res.status(404).send("No card exists");
    }

    return res.status(200).json({
      status: 200,
      message: "Card",
      data: data.rows,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", tokenExtractor, async (req, res, next) => {
  const query = "SELECT * FROM users where user_id=$1;";
  const value = [req.decodedToken.id];

  const { company, description, notes } = req.body;
  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) {
      return res.status(404).send("User does not exist");
    }
    const user = data.rows[0];

    const cardQuery =
      "INSERT INTO cards(company, description, notes, user_id) VALUES($1,$2,$3,$4) RETURNING *;";
    const cardValues = [company, description, notes || null, user.user_id];

    const cardData = await pool.query(cardQuery, cardValues);

    return res.status(201).json({
      status: 201,
      message: "Card added successfully",
      data: cardData.rows,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const query = "DELETE FROM cards where card_id=$1";
  const value = [id];

  try {
    const data = await pool.query(query, value);

    if (data.rowCount == 0) {
      return res.status(404).send("Card does not exist");
    }

    return res.status(200).json({
      status: 200,
      message: "Card successfully deleted",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
