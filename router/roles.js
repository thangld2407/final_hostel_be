const express = require("express");
const { getRoles, createRoles } = require("../controllers/roles.controller");

const roleRoute = express.Router();

roleRoute.get("/roles", getRoles);

roleRoute.post("/roles/create", createRoles);
module.exports = roleRoute;
