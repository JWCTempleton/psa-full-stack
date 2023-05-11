const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cardsRouter = require("./controllers/cards");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

dotenv.config();

app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Node.js listening on port ${port}`);
});
app.use(express.static("build"));

app.use("/api/cards", cardsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
