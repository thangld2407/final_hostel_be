const express = require("express");
const {
  getAllHostel,
  createHostel,
  deleteHostel,
  updateHostel,
} = require("../controllers/hostel.controller");
const hostel = require("../model/hostel");

const hostelRouter = express.Router();

hostelRouter.get("/hostel/getall", getAllHostel);
hostelRouter.post("/hostel/create", createHostel);
hostelRouter.post("/hostel/delete", deleteHostel);
hostelRouter.post("/hostel/update", updateHostel);

module.exports = hostelRouter;
