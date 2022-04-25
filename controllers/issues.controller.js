const Issues = require("../model/issues");
const User = require("../model/user");
const RoomForRent = require("../model/room_for_rent")
const sendEmail = require("../utils/nodemailer");

module.exports = {
  async getAllIssues(req, res, next) {
    try {
      const rs = await Issues.find().populate('user_id', '-password').lean();
      let rn = []
      for (result of rs) {
        const room = await RoomForRent.findOne({ user_id: result.user_id._id }).populate('room_id').lean();

        result = {
          ...result,
          room
        }
        rn.push(result)
      }
      res
        .status(200)
        .json({ message: "get all issues successfully", data: rn });
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
      const rsUser = await User.findOne({ user_id });
      const isRent = await RoomForRent.findOne({ user_id });
      console.log(isRent)
      if (isRent) {

        const saveIssues = await data.save();
        sendEmail({
          email: rsUser.email,
          subject: saveIssues.issues_content,
          html: `
          <b>
          Have we received a request to fix or update the problem? We will fix it as soon as possible.
          </b>
          <h3>Your problem: </h3>
          <p>${saveIssues.issues_content}</p>
          <em>
            Please wait!
          </em>
          `,
        });
        res.status(200).json({
          message: "create issues successfully",
          data: saveIssues,
        });
      } else {
        res.status(404).json({
          message: "User is not allowed to create issues",
          status: false
        })
      }
    } catch (error) {
      res.json({ error: "error issues create" });
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
