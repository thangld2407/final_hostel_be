const bank = require('../constant/bank.json')
module.exports = {
  async getListBank(req, res, next) {
    try {
      res.status(200).json({ bank })
    } catch (error) {
      res.json({ error: error })
    }
  }
}