const express = require("express");
const authRouter = require("./auth");
const roleRoute = require("./roles");
const user = require("./user");
const requireAuth = require("../middleware/auth");
const areaRouter = require("./area");

const router = express.Router();
router.use(authRouter);
router.use(requireAuth, user);
router.use(requireAuth, roleRoute);
router.use(requireAuth, areaRouter);
module.exports = router;
