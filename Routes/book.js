const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Book, validateBook } = require("../Models/Book");
const auth = require("../Middelware/auth");
const { User } = require("../Models/User");

router.get("/", async (req, res) => {
  const book = await Book.find();
  res.send(book);
});

router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book is not found");
  res.send(book);
});

router.post("/", async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let book = new Book({
    name: req.body.name,
    author: req.body.author,
    published: req.body.published,
    pages: req.body.pages,
    language: req.body.language
  });
  book = await book.save();
  res.send(book);
});

router.post("/readList/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book was not found");

  const user = await User.findOne({ _id: req.user._id });

  if (user.readList.id(req.params.id)) return res.send("Book already in List");

  user.readList.push(book);

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});

router.post("/delRead/:id", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  const read = user.readList.id(req.params.id);

  read.remove();

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});

router.post("/favList/:id", auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book was not found");

  const user = await User.findOne({ _id: req.user._id });

  if (user.favList.id(req.params.id)) return res.send("Book already in List");
  user.favList.push(book);

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});

router.post("/delFav/:id", auth, async (req, res) => {
  const user = await User.findById({ _id: req.user._id });
  const fav = user.favList.id(req.params.id);

  fav.remove();

  await user.save();

  res.send(_.pick(user, "email", "name", "readList", "favList"));
});
module.exports = router;
