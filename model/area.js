const mongoose = require("mongoose");

const Area = mongoose.Schema(
  {
    area_name: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Area", Area);
