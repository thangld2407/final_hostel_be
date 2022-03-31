const express = require("express");
const {
  getAllArea,
  createArea,
  updateArea,
  deleteArea,
} = require("../controllers/area.controller");

const areaRouter = express.Router();

areaRouter.get("/areas/", getAllArea);
areaRouter.post("/areas/create", createArea);
areaRouter.post("/areas/update", updateArea);
areaRouter.post("/areas/delete", deleteArea);

module.exports = areaRouter;
