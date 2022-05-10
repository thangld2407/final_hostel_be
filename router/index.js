const express = require("express");
const authRouter = require("./auth");
const roleRoute = require("./roles");
const userRouter = require("./user");
const requireAuth = require("../middleware/auth");
const areaRouter = require("./area");
const hostelRouter = require("./hoste");
const roomRouter = require("./room");
const invoiceRouter = require("./invoice");
const issuesRouter = require("./issues");
const roomForRent = require("./room_for_rent");
const paymentRouter = require("./payment");
const dashboard = require("./dashboard");
const roomMate = require("./roommate");

const router = express.Router();
router.use(authRouter);
router.use(paymentRouter);
router.use(requireAuth, userRouter);
router.use(requireAuth, roleRoute);
router.use(requireAuth, areaRouter);
router.use(requireAuth, hostelRouter);
router.use(requireAuth, roomRouter);
router.use(requireAuth, invoiceRouter);
router.use(requireAuth, issuesRouter);
router.use(requireAuth, roomForRent);
router.use(requireAuth, dashboard);
router.use(requireAuth, roomMate)
module.exports = router;
