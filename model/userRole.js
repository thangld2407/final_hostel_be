const mongoose = require("mongoose");

const userRole = new mongoose.Schema({
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("UserRole", userRole);
