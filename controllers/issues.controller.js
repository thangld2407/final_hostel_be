const res = require("express/lib/response");
const Issues = require("../model/issues");

module.exports = {
  async getAllIssues(req, res, next) {
    try {
      const rs = await Issues.find().lean();

      res
        .status(200)
        .json({ message: "get all issues successfully", data: rs });
    } catch (error) {
      res.json({ error: error });
    }
  },
  async createIssues(req, res, next) {
    try {
      const { issues_name, issues_content, status, user_id } = req.body;
      const data = new Issues({
        issues_name,
        issues_content,
        status,
        user_id,
      });
      const saveIssues = await data.save();
      console.log(data);
      res.status(200).json({
        message: "create issues successfully",
        data: saveIssues,
      });
    } catch (error) {
      res.json({ error: error });
    }
  },
};
