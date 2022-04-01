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
      res.status(200).json({
        message: "create issues successfully",
        data: saveIssues,
      });
    } catch (error) {
      res.json({ error: error });
    }
  },
  async updateIssue(req, res, next) {
    try {
      const id = req.body.issuse_id;
      const isId = await Issues.findById(id);
      if (!isId) {
        res.status(404).json({
          message: "Invalid id",
        });
      } else {
        const newData = { ...req.body, status: req.body.status };
        const options = { new: true };
        await Issues.findByIdAndUpdate(id, newData, options);
        res.status(200).json({
          message: "update issue successfully",
        });
      }
    } catch (error) {
      res.json({ error: "ERROR__ISSUESS" });
    }
  },
};
