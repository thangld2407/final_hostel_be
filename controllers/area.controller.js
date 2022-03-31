const Area = require("../model/area");

module.exports = {
  async getAllArea(req, res, next) {
    try {
      const rs = await Area.find();
      res.status(200).json({
        message: "get area success full",
        data: rs,
      });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  async createArea(req, res, next) {
    const { area_name } = req.body;
    try {
      const data = new Area({ area_name });
      const isArea = await Area.findOne({ area_name });
      if (isArea) {
        res.status(401).json({ message: "Area already exists" });
      } else {
        const saveArea = data.save();
        res.status(200).json({
          message: "Area created successfully",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
  async updateArea(req, res) {
    try {
      const id = req.body.id;
      const options = { new: true };
      const newData = req.body;
      if (!id) {
        res.status(404).json({ message: "Area not found" });
      } else {
        const rs = await Area.findByIdAndUpdate(id, newData, options);
        res.status(200).json({
          message: "Success to update",
          data: rs,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async deleteArea(req, res) {
    try {
      const id = req.body.id;
      if (!id) {
        res.status(401).json({ message: "Invalid params" });
      } else {
        await Area.findByIdAndRemove(id);
        res.status(200).json({
          message: "Success to delete",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error });
    }
  },
};
