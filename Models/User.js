const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const keys = require("../Config/keys");
const { bookSchema } = require("../Models/Book");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  readList: [bookSchema],
  favList: [bookSchema],
  inReadingList: [bookSchema]
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id }, keys.tokenSecretKey, {
    expiresIn: "365 days"
  });

  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    name: joi.string().required(),
    email: joi
      .string()
      .required()
      .email(),
    password: joi
      .string()
      .required()
      .min(6)
      .max(12)
  };
  return joi.validate(user, schema);
}

function updateUser(user) {
  const schema = {
    name: joi.string(),
    password: joi.string(),
    newPW: joi
      .string()
      .min(6)
      .max(12)
  };
  return joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.updateUser = updateUser;
