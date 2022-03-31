const mongoose = require("mongoose");

const RoomForRent = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    hostel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
    },
  },
  {
    timestamps: {
      createAt: "createAt",
      updateAt: "updateAt",
    },
  }
);

module.exports = mongoose.model("RoomForRent", RoomForRent);
