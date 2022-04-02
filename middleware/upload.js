const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/xlsx"));
  },
  filename: function (req, file, cb) {
    cb(null, `invoice-${file.fieldname}-${Date.now()}.xlsx`);
  },
});

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes("excel") ||
    file.mimetype.includes("spreadsheetml")
  ) {
    cb(null, true);
  } else {
    cb("Please upload only file excel", false);
  }
};

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });
module.exports = uploadFile;
