const express = require("express");
const {
  getAllInvoice,
  createNewInvoice,
  updateInvoice,
  uploadInvoiceByExcel,
} = require("../controllers/invoice.controller");
const upload = require("../middleware/upload");
const invoiceRouter = express.Router();

invoiceRouter.get("/invoice/getall", getAllInvoice);
invoiceRouter.post("/invoice/create", createNewInvoice);
invoiceRouter.post("/invoice/update", updateInvoice);
invoiceRouter.post(
  "/invoice/upload",
  upload.single("file"),
  uploadInvoiceByExcel
);
module.exports = invoiceRouter;
