const bcrypt = require("bcryptjs");
const User = require("../model/user");
const userRole = require("../model/userRole");
const { createToken } = require("../utils/jwt");

function generatePassword(password, hash) {
  return bcrypt.compareSync(password, hash); // true
}
module.exports = {
  async Login(req, res) {
    const { email, password } = req.body;
    try {
      const isEmail = await User.findOne({ email }).lean();
      if (!isEmail) {
        return res.status(401).json({
          message: "Account or password is not correct",
        });
      }
      if (!generatePassword(password, isEmail.password)) {
        return res.status(401).json({
          message: "Account or password is not correct",
        });
      }
      const userInfor = await userRole
        .findOne({ user_id: isEmail._id })
        .populate("role_id")
        .populate("user_id", "-password")
        .lean();
      const accessToken = createToken({
        users: userInfor,
      });
      res.header("authorization", accessToken);
      return res.status(200).json({
        message: "Login successful",
        data: userInfor,
        accessToken: accessToken,
      });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
};
