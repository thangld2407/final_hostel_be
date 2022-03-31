const bcrypt = require("bcryptjs");

const User = require("../model/user");
const userRole = require("../model/userRole");
const UserRole = require("../model/userRole");
const { validEmail, validPassword } = require("../utils/validation");

module.exports = {
  async getAllUser(req, res) {
    const data = await User.find();
    try {
      res.status(200).json({
        message: "success to get all data",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        message: "error",
        data: err.message,
      });
    }
  },
  async getOneUser(req, res) {
    try {
      const data = await User.findById(req.body.id);
      const userInfor = await userRole
        .find({ user_id: data._id })
        .populate("role_id")
        .populate("user_id", "-password")
        .lean();
      res.status(200).json({
        message: "success",
        data: userInfor,
      });
    } catch (error) {
      res.status(500).json({
        message: "error",
        error: error.message,
      });
    }
  },
  async createUser(req, res) {
    const {
      fullname,
      email,
      password,
      role_id,
      id_card,
      date_of_birth,
      gender,
      hometown,
      rental_date,
      username,
    } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const data = new User({
      fullname,
      email,
      password: hashPassword,
      id_card,
      date_of_birth,
      gender,
      hometown,
      rental_date,
      username,
    });
    const userRole = new UserRole({
      role_id: role_id,
      user_id: data._id,
    });

    try {
      let user = await User.findOne({ fullname });
      if (user) {
        res.json({
          message: "User already exists",
        });
      } else if (!validEmail(email)) {
        res.json({ message: "Invalid email" });
      } else if (!validPassword(password)) {
        res.json({ message: "Password must be at least > 8 character" });
      } else {
        const dataToSave = await data.save();
        const dataUserRole = await userRole.save();
        res.status(200).json({
          message: "Success to create",
          data: { user: dataToSave, role: dataUserRole },
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  async updateUser(req, res, next) {
    try {
      const id = req.body.user_id;
      const options = { new: true };
      const newData = {
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
      };
      const rs = await User.findByIdAndUpdate(id, newData, options);
      if (rs !== null) {
        res.status(200).json({
          message: "Success to update",
          data: rs,
        });
      } else {
        res.status(200).json({
          message: "nothing to update",
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      await User.findByIdAndRemove(id);
      res.status(200).json({
        message: "Success to delete",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
