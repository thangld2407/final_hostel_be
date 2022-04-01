const express = require("express");
const {
  getAllIssues,
  createIssues,
} = require("../controllers/issues.controller");

const issuesRouter = express.Router();

issuesRouter.get("/issues/getall", getAllIssues);
issuesRouter.post("/issues/create", createIssues);
module.exports = issuesRouter;
