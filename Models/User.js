const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("config");
const dev = require("../Config/dev");

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
  }
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id }, dev.tokenSecretKey, {
    expiresIn: "2 days"
  });
  console.log(token);
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
    password: joi.string().required()
  };
  return joi.validate(user, schema);
}

function updateUser(user) {
  const schema = {
    name: joi.string(),
    password: joi.string()
  };
  return joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.updateUser = updateUser;
