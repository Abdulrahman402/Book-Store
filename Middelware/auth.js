const jwt = require("jsonwebtoken");
const { User } = require("../Models/User");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (e) {
    res.status(401).send("Authentication failed");
  }
};
