const express = require("express");
const {
  getAllInvoice,
  createNewInvoice,
  updateInvoice,
} = require("../controllers/invoice.controller");

const invoiceRouter = express.Router();

invoiceRouter.get("/invoice/getall", getAllInvoice);
invoiceRouter.post("/invoice/create", createNewInvoice);
invoiceRouter.post("/invoice/update", updateInvoice);
module.exports = invoiceRouter;
