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

const router = express.Router();
router.use(authRouter);
router.use(paymentRouter);
router.use(userRouter);
router.use(roleRoute);
router.use(areaRouter);
router.use(hostelRouter);
router.use(roomRouter);
router.use(invoiceRouter);
router.use(issuesRouter);
router.use(roomForRent);
module.exports = router;
