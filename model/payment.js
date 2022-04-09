const mongoose = require("mongoose");

const Payment = mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    bank_code: {
      type: String,
      trim: true,
    },
    transaction_no: {
      type: Number,
      trim: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
    },
  }
);

module.exports = mongoose.model("Payment", Payment);
