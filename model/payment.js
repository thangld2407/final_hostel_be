const mongoose = require("mongoose");

const Payment = mongoose.Schema(
  {
    invoice_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      require: true,
    },
    vnp_amount: {
      type: Number,
      require: true,
      trim: true,
    },
    vnp_orderInfor: {
      type: String,
      require: true,
      trim: true,
    },
    vnp_transactionNo: {
      type: Number,
      requir: true,
      trim: true,
    },
    vnp_responseCode: {
      type: Number,
      length: [1 - 15],
      require: true,
    },
    vnp_transactionStatus: {
      type: Number,
      require: true,
    },
    vnp_txnRef: {
      type: String,
      require: true,
      trim: true,
    },

    vnp_bankCode: {
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
