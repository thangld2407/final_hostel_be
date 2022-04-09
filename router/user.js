const express = require("express");
const {
  getOneUser,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const userRouter = express.Router();

userRouter.get("/user/getall", getAllUser);
userRouter.get("/user/getone", getOneUser);
userRouter.post("/user/create", createUser);
userRouter.post("/user/update", updateUser);
userRouter.post("/user/delete", deleteUser);

module.exports = userRouter;
