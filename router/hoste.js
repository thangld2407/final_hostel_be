const express = require("express");
const {
  getAllHostel,
  createHostel,
  deleteHostel,
  updateHostel,
  getOneHostel,
} = require("../controllers/hostel.controller");
const hostelRouter = express.Router();

hostelRouter.get("/hostel/getall", getAllHostel);
hostelRouter.get("/hostel/getone", getOneHostel);
hostelRouter.post("/hostel/create", createHostel);
hostelRouter.post("/hostel/delete", deleteHostel);
hostelRouter.post("/hostel/update", updateHostel);

module.exports = hostelRouter;
