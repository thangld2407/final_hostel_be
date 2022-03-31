const express = require("express");
const {
  getAllRoom,
  createRoom,
  deleteRoom,
  updateRoom,
} = require("../controllers/room.controller");
const uploadImg = require("../middleware/upload");
const roomRouter = express.Router();

roomRouter.get("/room/getall", getAllRoom);
roomRouter.post("/room/create", uploadImg, createRoom);
roomRouter.post("/room/update", uploadImg, updateRoom);
roomRouter.post("/room/delete", deleteRoom);

module.exports = roomRouter;
