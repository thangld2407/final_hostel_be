const express = require("express");
const {
  getAllRoom,
  createRoom,
  deleteRoom,
  updateRoom,
} = require("../controllers/room.controller");
const roomRouter = express.Router();

roomRouter.get("/room/getall", getAllRoom);
roomRouter.post("/room/create", createRoom);
roomRouter.post("/room/update", updateRoom);
roomRouter.post("/room/delete", deleteRoom);

module.exports = roomRouter;
