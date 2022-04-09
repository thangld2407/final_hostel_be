const express = require("express");
const {
  getAllRoom,
  createRoom,
  deleteRoom,
  updateRoom,
  getOneRoom,
} = require("../controllers/room.controller");
const roomRouter = express.Router();

roomRouter.get("/room/getall", getAllRoom);
roomRouter.get("/room/getone", getOneRoom);
roomRouter.post("/room/create", createRoom);
roomRouter.post("/room/update", updateRoom);
roomRouter.post("/room/delete", deleteRoom);

module.exports = roomRouter;
