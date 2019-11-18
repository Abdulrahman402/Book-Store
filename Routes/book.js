const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Book, validateBook } = require("../Models/Book");

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

module.exports = router;
