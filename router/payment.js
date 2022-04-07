const express = require("express");
const {
  createPayment,
  getPayment,
} = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.get("/payment", getPayment);
paymentRouter.post("/payment/create-url", createPayment);

module.exports = paymentRouter;
