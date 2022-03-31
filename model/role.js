const mongoose = require("mongoose");

const roles = new mongoose.Schema({
  role_name: {
    enum: ["admin", "manager", "builder", "customer"],
    type: String,
    default: "customer",
  },
  active: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Role", roles);
