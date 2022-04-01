const express = require("express");
const {
  registerRoomUser,
  getAllRoomRental,
  cancelRoomRental,
} = require("../controllers/registerRoomUser.controller");

const roomForRent = express.Router();

roomForRent.get("/room/rent/getall", getAllRoomRental);
roomForRent.post("/room/rent/register", registerRoomUser);
roomForRent.post("/room/rent/cancel", cancelRoomRental);

module.exports = roomForRent;
