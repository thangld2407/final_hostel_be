const mongoose = require("mongoose");
const { validEmail } = require("../utils/validation");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      required: true,
      type: String,
    },
    email: {
      required: true,
      type: String,
      unique: true,
      lowercase: true,
    },
    id_card_number: {
      required: false,
      type: Number,
    },
    date_of_birth: {
      required: false,
      type: String,
    },
    telephone: {
      required: false,
      type: Number,
    },
    gender: {
      required: false,
      type: Number,
    },
    rental_date: {
      required: false,
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      required: true,
      type: String,
    },
    hometown: {
      required: false,
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updateAt",
    },
  }
);

module.exports = mongoose.model("User", userSchema);
