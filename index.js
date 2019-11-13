const express = require("express");
const app = express();
const winston = require("winston");
const mongoose = require("mongoose");
const user = require("./Routes/user");
const auth = require("./Routes/auth");

mongoose
  .connect("mongodb://abdo00:node2314@ds245018.mlab.com:45018/book-store-dev")
  .then(() => console.log("Connected to Book-Store DB"))
  .catch(err => console.log("Error while connecting DB", err));

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  winston.info(`Listening on port ${port}`);
});

app.use(express.json());
app.use("/api/users", user);
app.use("/api/auth", auth);

module.exports = server;
