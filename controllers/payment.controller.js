module.exports = {
  createPayment(req, res, next) {
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;

    res.json({
      data: ipAddr,
    });
  },
};
