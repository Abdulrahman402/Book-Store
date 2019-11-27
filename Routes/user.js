const express = require("express");
const app = express();
const { validateUser, updateUser, User } = require("../Models/User");
const auth = require("../Middelware/auth");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

// Getting all users
router.get("/", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

// Getting the current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

// Find a particular user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) return res.status(400).send("User with given ID not found");
  res.send(user);
});

// Registering user
router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already Registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  const token = await user.generateAuthToken();

  await user.save();

  res.header("x-auth-token", token).send(_.pick(user, "email", "name"));
});

//Change name
router.put("/name", auth, async (req, res) => {
  const { error } = updateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name: req.body.name } },
    { new: true }
  );

  if (!user) return res.status(400).send("The user with given ID not found");

  res.send(_.pick(user, "email", "name"));
});

// Change password
router.put("/password", auth, async (req, res) => {
  const { error } = updateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { password: req.body.password },
    { new: true }
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(_.pick(user, "email", "name"));
});

router.post("/fav", auth);

module.exports = router;
