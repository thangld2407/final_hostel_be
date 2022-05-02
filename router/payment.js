const express = require("express");
const { getListBank } = require("../controllers/bank.controller");
const {
  createPayment,
  getPayment,
} = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.get("/payment/bank", getListBank)
paymentRouter.get("/payment", getPayment);
paymentRouter.post("/payment/create-url", createPayment);

module.exports = paymentRouter;
