const jwt = require("jsonwebtoken");
const { User } = require("../Models/User");
const dev = require("../Config/dev");

module.exports = async (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied");
  try {
    const decoded = jwt.verify(token, dev.tokenSecretKey);
    req.user = decoded;

    next();
  } catch (e) {
    res.status(401).send("Authentication failed");
  }
};
