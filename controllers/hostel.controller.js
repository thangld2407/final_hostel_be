const Hostel = require("../model/hostel");
const sendEmail = require("../utils/nodemailer");

module.exports = {
  async getAllHostel(req, res) {
    try {
      const rs = await Hostel.find();
      res.status(200).json({
        message: "get hostel successfully",
        data: rs,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getOneHostel(req, res, next) {
    const id = req.body.id;
    try {
      if (id) {
        const data = await Hostel.findById({ _id: id }).populate("area_id");
        if (data) {
          res.status(200).json({
            status: true,
            message: "Get One Hostel successfully",
            data: data,
          });
        } else {
          res.status(403).json({
            status: false,
            message: "Couldn't find a hostel'",
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        message: "get hostel failed",
      });
    }
  },
  async createHostel(req, res) {
    const { hostel_name, address, area_id } = req.body;
    const data = new Hostel({ hostel_name, address, area_id });
    try {
      let isHostel = await Hostel.findOne({ hostel_name });
      if (isHostel) {
        res.status(401).json({
          message: "hostel already exists",
        });
      } else {
        const hostelSave = await data.save();
        res.status(200).json({
          message: "hostel saved successfully",
          data: hostelSave,
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateHostel(req, res) {
    const id = req.body.hostel_id;
    const options = { new: true };
    const newData = { ...req.body };
    try {
      const rs = await Hostel.findByIdAndUpdate(id, newData, options);
      res.status(200).json({
        message: "hostel updated successfully",
        data: rs,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteHostel(req, res) {
    const id = req.body.hostel_id;
    try {
      const isID = await Hostel.findById(id);
      if (isID) {
        await Hostel.findByIdAndRemove(id);
        res.status(200).json({ message: "delete successfully" });
      } else {
        res.status(401).json({ message: "Hostel not found" });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
