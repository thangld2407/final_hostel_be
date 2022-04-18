const RoomForRent = require("../model/room_for_rent");
const Room = require("../model/room");
const User = require("../model/user");

module.exports = {
  async registerRoomUser(req, res, next) {
    try {
      const { user_id, room_id } = req.body;
      const dataRoom = await Room.findById(room_id).lean();
      const dataUser = await User.findById(user_id).lean();
      console.log(dataUser);
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
        await Room.findOneAndUpdate(
          { room_id },
          { status: true },
          { new: true }
        );
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
  async getAllRoomRental(req, res, next) {
    try {
      const rent = await RoomForRent.find();
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
      const dataRoomRental = await RoomForRent.findOne({ id });
      const dataRoom = await Room.findOne(dataRoomRental.room_id);
      if (!dataRoom.status) {
        res.status(401).json({ message: "Room not found, please try again" });
      } else {
        const dataRoomUpdate = await Room.findByIdAndUpdate(
          dataRoom.id,
          { status: false },
          { new: true }
        );
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
