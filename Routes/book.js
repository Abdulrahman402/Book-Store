const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Book } = require("../Models/Book");
const auth = require("../Middelware/auth");
const { User } = require("../Models/User");

// Getting all books
router.get("/", async (req, res) => {
  const page = req.query.page;
  const perPage = 20;
  const query = req.query.search;

  const book = await Book.find({
    title: { $regex: query, $options: "i" }
  })
    .limit(perPage)
    .skip((page - 1) * perPage);

  res.send(book);
});

// Getting a particular book
router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book is not found");
  res.send(book);
});

// Add book was read to read list
router.post("/readList/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book was not found");

  const user = await User.findOne({ _id: req.user._id });

  if (req.body.action === "Add") {
    if (user.readList.id(req.params.id))
      return res.send("Book already in List");
    user.readList.push(book);
  } else {
    user.readList.remove(req.params.id);
  }

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});

// Add favourite books to favourite list
router.post("/favList/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book was not found");

  const user = await User.findOne({ _id: req.user._id });

  if (req.body.action === "Add") {
    if (user.favList.id(req.params.id)) return res.send("Book already in List");
    user.favList.push(book);
  } else {
    user.favList.remove(req.params.id);
  }

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});

// Add book being read at the moment
router.post("/inReadingList/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book was not found");

  const user = await User.findOne({ _id: req.user._id });

  if (req.body.action === "Add") {
    if (user.inReadingList.id(req.params.id))
      return res.send("Book already in list");
    user.inReadingList.push(book);
  } else {
    user.inReadingList.remove(req.params.id);
  }
  await user.save();
  res.send(
    _.pick(user, "email", "name", "readList", "favList", "inReadingList")
  );
});

module.exports = router;
