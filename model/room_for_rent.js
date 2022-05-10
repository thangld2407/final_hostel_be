const mongoose = require("mongoose");

const RoomForRent = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    date: {
      type: Date,
      required: true,
    },
    room_mate: {
      type: Array,
      trim: true,
    }
  },
  {
    timestamps: {
      createAt: "createAt",
      updateAt: "updateAt",
    },
  }
);

module.exports = mongoose.model("RoomForRent", RoomForRent);
