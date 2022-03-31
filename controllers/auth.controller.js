const bcrypt = require("bcryptjs");
const User = require("../model/user");
const userRole = require("../model/userRole");
const { createToken } = require("../utils/jwt");

function generatePassword(password, hash) {
  return bcrypt.compareSync(password, hash); // true
}
module.exports = {
  async Login(req, res) {
    const { username, password } = req.body;
    try {
      const isUsername = await User.findOne({ username }).lean();
      if (!isUsername) {
        return res.status(401).json({
          message: "Account or password is not correct",
        });
      }
      if (!generatePassword(password, isUsername.password)) {
        return res.status(401).json({
          message: "Account or password is not correct",
        });
      }
      const userInfor = await userRole
        .find({ user_id: isUsername._id })
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
