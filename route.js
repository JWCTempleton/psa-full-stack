const express = require("express");
const router = express.Router();

const { getCards } = require("./controllers/cards");

router.get("/", getCards);

module.exports = router;
