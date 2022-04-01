const mongoose = require("mongoose");

const Issues = mongoose.Schema(
  {
    issues_name: {
      type: String,
      trim: true,
      required: true,
    },
    issues_content: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: {
      createAt: "createAt",
    },
  }
);

module.exports = mongoose.model("Issues", Issues);
