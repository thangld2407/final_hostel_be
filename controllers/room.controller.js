const Room = require("../model/room");
const RoomForRent = require("../model/room_for_rent");
module.exports = {
  async getAllRoom(req, res, next) {
    try {
      const rs = await Room.find().populate('hostel_id');
      res.status(200).json({
        message: "get all room succesfully",
        data: rs,
      });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
  async updateRoom(req, res, next) {
    try {
      const id = req.body.room_id;
      const options = { new: true };

      const newData = req.body;
      const isRoom = await Room.findById({ _id: id });
      console.log(isRoom);
      const findRoom = await RoomForRent.findOne({
        room_id: isRoom._id,
      }).lean();

      await Room.findByIdAndUpdate(id, newData, options);
      if (findRoom) {
        await RoomForRent.findByIdAndDelete({ _id: findRoom._id }).lean();
      }
      res.status(200).json({
        message: "Success to update",
      });
    } catch (error) {
      res.status(404).json({ message: "ERROR-UPDATE ROOM" });
    }
  },
  async getOneRoom(req, res, next) {
    const id = req.query.id;

    try {
      const request = await RoomForRent.findOne({ room_id: id }).populate('user_id', '-password').lean();
      const room_id = await Room.findById({ _id: id }).populate("hostel_id").lean();
      let user_id = {}
      res.status(200).json({
        message: "get one room successfully",
        data: {
          room: room_id,
          user: user_id,
          request: request
        }
      })

    } catch (error) {
      res.json({ error: "ERROR GET ONE ROOM" });
    }
  },
  async createRoom(req, res, next) {
    try {
      const { hostel_id, room_name, price, description, status, service } = req.body;
      const data = new Room({
        hostel_id,
        room_name,
        price,
        description,
        service,
        status,
      });

      const isRoom = await Room.findOne({ room_name });
      if (isRoom) {
        res.status(401).json({
          message: "The room already exists",
        });
      } else {
        const dataSave = await data.save();
        res.status(200).json({
          message: "create room successfully",
          data: dataSave,
        });
      }
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
  async deleteRoom(req, res, next) {
    try {
      const id = req.body.room_id;
      await Room.findByIdAndRemove(id);
      res.status(200).json({
        message: "Room deleted successfully",
      });
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
};
