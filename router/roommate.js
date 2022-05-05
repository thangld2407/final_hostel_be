const express = require("express");
const { addRoomMate } = require("../controllers/roommate.controller");
const roomMate = express.Router();

roomMate.post('/roommate/create', addRoomMate);

module.exports = roomMate;