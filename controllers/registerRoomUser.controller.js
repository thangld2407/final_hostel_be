const RoomForRent = require("../model/room_for_rent");
const Room = require("../model/room");
const User = require("../model/user");

module.exports = {
  async registerRoomUser(req, res, next) {
    try {
      const { user_id, room_id } = req.body;
      const dataRoom = await Room.findById({ _id: room_id }).lean();
      const dataUser = await User.findById({ _id: user_id }).lean();
      if (dataRoom.status === true) {
        res.status(401).json({
          message: "The room already have a user",
        });
      } else if (dataUser === null) {
        res.json({
          message: "User not found ",
          status: false,
        });
      } else {
        await Room.findByIdAndUpdate(room_id, { status: true });
        const dataForRent = new RoomForRent({ user_id, room_id });
        await dataForRent.save();
        res.status(200).json({
          message: "Register room successfully",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ error: "ERRORR - REGISTER_ROOM_USER" });
    }
  },
  async getDetailRegisterRoom(req, res, next) {
    try {
      const request_id = req.query.request_id;
      const response = await RoomForRent.findById({ _id: request_id })
        .populate("user_id", "-password")
        .populate("room_id")
        .lean();
      if (response === null) {
        res.status(200).json({
          message: "Request not found",
          status: false
        })
      } else {

        res.status(200).json({ request: response, message: "get detail request success", status: true });
      }
    } catch (error) {
      res.status(403).json({ error: "ERROR DETAIL ONE REGISTER" });
    }
  },
  async getAllRoomRental(req, res, next) {
    try {
      const rent = await RoomForRent.find()
        .populate("user_id", "-password")
        .populate("room_id");
      res.status(200).json({
        message: "get room for rent successfully",
        data: rent,
      });
    } catch (error) {
      res.json({ error: "ERRORR - GET ALL" });
    }
  },
  async cancelRoomRental(req, res) {
    try {
      const id = req.body.room_rental_id;
      const dataRoomRental = await RoomForRent.findById({ _id: id });
      const dataRoom = await Room.findById({ _id: dataRoomRental.room_id });
      if (!dataRoom.status) {
        res.status(401).json({ message: "Room not found, please try again" });
      } else {
        const dataRoomUpdate = await Room.findByIdAndUpdate(
          dataRoom.id,
          { status: false },
          { new: true }
        );
        await RoomForRent.findByIdAndRemove({ _id: dataRoomRental._id });
        res.status(200).json({
          message: "cancel room successfully",
          data: dataRoomUpdate,
        });
      }
    } catch (error) {
      res.json({ error: "ERRORR - CANCELLED" });
    }
  },
};
