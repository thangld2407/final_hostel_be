const Invoice = require("../model/invoice");

module.exports = {
  async getTurnover(req, res, next) {
    try {
      const { y_month } = req.query;
      const data = await Invoice.find(({ date_month: y_month }))
      const sum = data.reduce((acc, currentValue, currentIndex, arr) => {
        console.log(acc, currentValue)
        return acc + currentValue.total;
      }, 0);
      res.status(200).json({
        statusCode: 200,
        data: sum
      })
    } catch (error) {
      res.json({
        message: "Error getting turnover",
        status: false,
      })
    }
  }
}