const { verifyToken } = require("../utils/jwt");
const User = require("../model/user");

module.exports = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(500).json({
        error: "Unauthorized",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
    const user = await User.findById(decoded.users[0].user_id._id);
    if (!user) {
      res.json({ error: "Unauthorization" });
    }

    req.uid = decoded.id;
    next();
  } catch (err) {
    res.json({ error: err.message });
  }
};
