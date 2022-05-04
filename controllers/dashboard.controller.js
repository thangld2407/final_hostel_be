const invoice = require("../model/invoice");
const Invoice = require("../model/invoice");
const room = require("../model/room");

function calculate(array) {
  const sum = array.reduce((acc, currentValue, currentIndex, arr) => {
    return acc + currentValue.total;
  }, 0);
  return sum;
}

module.exports = {
  async getTurnoverByMonth(req, res, next) {
    try {
      const { y_month } = req.query;
      if (!y_month) {
        res.status(403).json({
          message: "cannot find ",
        });
      } else {
        const data = await Invoice.find({ date_month: y_month });
        const sum = data.reduce((acc, currentValue, currentIndex, arr) => {
          console.log(acc, currentValue);
          return acc + currentValue.total;
        }, 0);
        res.status(200).json({
          statusCode: 200,
          total: sum,
        });
      }
    } catch (error) {
      res.json({
        message: "Error getting turnover",
        status: false,
      });
    }
  },
  async getTurnoverByArea(req, res, next) {
    try {
      const { hostel, date } = req.query;

      const roomFound = await room.find({ hostel_id: hostel });
      let arrInvoice = [];

      for (i of roomFound) {
        const rs = await invoice.findOne({ room_id: i._id, date_month: date });
        arrInvoice.push(rs);
      }
      const sum = calculate(arrInvoice);
      res.json({
        total: sum || 0,
      });
    } catch (error) {
      res.json({ error: "ERROR DASHBOARD AREA" });
    }
  },
};
