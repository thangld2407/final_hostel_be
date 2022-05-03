const express = require("express");
const { getTurnover } = require("../controllers/dashboard.controller");

const dashboard = express.Router();

dashboard.get('/dashboard', getTurnover)

module.exports = dashboard;