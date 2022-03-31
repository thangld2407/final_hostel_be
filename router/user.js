const express = require("express");
const {
  getOneUser,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const user = express.Router();

user.get("/user/getall", getAllUser);
user.get("/user/getone", getOneUser);
user.post("/user/create", createUser);
user.post("/user/update", updateUser);
user.post("/user/delete/:id", deleteUser);

module.exports = user;
