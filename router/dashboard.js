const express = require("express");
const {
  getTurnoverByMonth,
  getTurnoverByArea,
} = require("../controllers/dashboard.controller");

const dashboard = express.Router();

dashboard.get("/dashboard", getTurnoverByMonth);
dashboard.get("/dashboard/area", getTurnoverByArea);
module.exports = dashboard;
