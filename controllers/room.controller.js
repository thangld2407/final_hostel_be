const Room = require("../model/room");
const getPath = require("../utils/getPath");
const { isEmptyOrWhiteSpace } = require("../utils/validation");

module.exports = {
  async getAllRoom(req, res, next) {
    try {
      const rs = await Room.find();
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

      const filePath = req.file.path.split("\\");
      const newData = {
        ...req.body,
        image: getPath(filePath),
      };
      const rs = await Room.findByIdAndUpdate(id, newData, options);
      res.status(200).json({
        message: "Success to update",
        data: rs,
      });
    } catch (error) {
      res.status(404).json({ message: error });
    }
  },
  async createRoom(req, res, next) {
    try {
      const { hostel_id, room_name, price, description, status } = req.body;
      const image = req.file.path.split("\\");
      let filePath = getPath(image);
      const data = new Room({
        hostel_id,
        room_name,
        image: filePath,
        price,
        description,
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
