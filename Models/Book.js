const mongoose = require("mongoose");
const joi = require("joi");

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  puplished: Number,
  pages: Number,
  language: String
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = {
    name: joi.string().required(),
    author: joi.string().required(),
    puplished: joi.number().required(),
    pages: joi.number().required(),
    language: joi.string().required()
  };
  return joi.validate(book, schema);
}

module.exports.Book = Book;
module.exports.validateBook = validateBook;
