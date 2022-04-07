const mongoose = require("mongoose");

const Payment = mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    response_code: {
      type: String,
      trim: true,
    },
    bank_code: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
    },
  }
);

module.exports = mongoose.model("Payment", Payment);
