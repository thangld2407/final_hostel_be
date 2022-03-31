const mongoose = require("mongoose");

const Hostel = mongoose.Schema({
  hostel_name: {
    type: String,
    trim: true,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,
  },
  area_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Area",
  },
});

module.exports = mongoose.model("Hostel", Hostel);
