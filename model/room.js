const mongoose = require("mongoose");

const Room = mongoose.Schema(
  {
    hostel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    room_name: {
      type: String,
      required: true,
      trim: true,
    },
    service: {
      type: Array,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "createAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Room", Room);
