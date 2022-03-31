const mongoose = require("mongoose");

const Area = mongoose.Schema({
  area_name: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Area", Area);
