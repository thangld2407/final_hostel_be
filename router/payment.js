const express = require("express");
const { createPayment } = require("../controllers/payment.controller");

const paymentRouter = express.Router();

paymentRouter.post("/payment/create-url", createPayment);

module.exports = paymentRouter;
