const express = require("express");
const authRouter = require("./auth");
const roleRoute = require("./roles");
const user = require("./user");
const requireAuth = require("../middleware/auth");
const areaRouter = require("./area");
const hostelRouter = require("./hoste");
const roomRouter = require("./room");

const router = express.Router();
router.use(authRouter);
router.use(requireAuth, user);
router.use(requireAuth, roleRoute);
router.use(requireAuth, areaRouter);
router.use(requireAuth, hostelRouter);
router.use(requireAuth, roomRouter);
module.exports = router;
