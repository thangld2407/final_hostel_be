const mongoose = require("mongoose");

const Invoice = mongoose.Schema(
  {
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },
    water_consumed_per_month: {
      type: Number,
      required: true,
      trim: true,
    },
    electricity_consumed_per_month: {
      type: Number,
      required: true,
      trim: true,
    },

    other_service: {
      type: Array,
      trim: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    date_month: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createAt: "createAt",
      updateAt: "updateAt",
    },
  }
);

module.exports = mongoose.model("Invoice", Invoice);
