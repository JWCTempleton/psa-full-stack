const express = require("express");
const router = express.Router();

const { getCards } = require("./controllers/cards");
const { getUsers } = require("./controllers/users");

router.get("/", getCards);
router.get("/", getUsers);

module.exports = router;
