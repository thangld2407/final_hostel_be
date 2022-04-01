const express = require("express");
const {
  getAllIssues,
  createIssues,
  updateIssue,
} = require("../controllers/issues.controller");

const issuesRouter = express.Router();

issuesRouter.get("/issues/getall", getAllIssues);
issuesRouter.post("/issues/create", createIssues);
issuesRouter.post("/issues/update", updateIssue);
module.exports = issuesRouter;
