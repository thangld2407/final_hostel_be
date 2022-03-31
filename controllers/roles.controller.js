const Role = require("../model/role");

module.exports = {
  async getRoles(req, res) {
    try {
      const rs = await Role.find();
      res.status(200).json({
        message: "Success fully to get all roles",
        data: rs,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async createRoles(req, res) {
    const { role_name, status } = req.body;
    try {
      const data = new Role({ role_name, status });
      let isRole = await Role.findOne({ role_name });
      if (isRole) {
        res.status(401).json({
          message: "Role already exists",
        });
      } else {
        const saveRole = await data.save();
        res.status(200).json({
          message: "Role created successfully",
          data: saveRole,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
