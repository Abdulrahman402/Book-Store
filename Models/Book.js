const mongoose = require("mongoose");
const joi = require("joi");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  puplisher: String,
  authors: String,
  page: Number,
  year: Number,
  rating: Number,
  desc: String,
  isbn13: String,
  image: String,
  url: String,
  price: Number,
  language: String
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = {
    name: joi.string().required(),
    author: joi.string().required(),
    puplished: joi.string().required(),
    pages: joi.number().required(),
    language: joi.string().required()
  };
  return joi.validate(book, schema);
}

module.exports.Book = Book;
module.exports.validateBook = validateBook;
module.exports.bookSchema = bookSchema;
