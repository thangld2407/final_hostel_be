const Invoice = require("../model/invoice");
const Payment = require("../model/payment");

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = {
  async createPayment(req, res, next) {
    const { user_id, date_month } = req.body;

    if (!user_id || !date_month) {
      res.status(401).json({
        status: "error",
        message: "You must be send user_id and date of month before creating payment",
      });
    } else {
      const invoice = await Invoice.findOne({ user_id: user_id, date_month: date_month }).populate(
        "room_id"
      );
      if (!invoice) {
        res.status(403).json({ message: "Invoice in month has already", status: false })
      } else {
        if (invoice.status) {
          res.status(401).json({ message: "Invoice already exists pay" });
        } else {
          const ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
          let dateFormat = require("dateformat");

          let tmnCode = process.env.vnp_TmnCode;
          let secretKey = process.env.vnp_HashSecret;
          let vnpUrl = process.env.vnp_Url;
          let returnUrl = process.env.vnp_ReturnUrl;

          let date = new Date();

          let createDate = dateFormat(date, "yyyymmddHHmmss");
          let orderId = dateFormat(date, "HHmmss");
          let amount = invoice.total;
          let bankCode = req.body.bankCode;

          let orderInfo = `Payment for room ${invoice.room_id.room_name}`;
          let orderType = "pay";
          let locale = req.body.language;
          if (locale === null || locale === "") {
            locale = "vn";
          }
          let currCode = "VND";
          let vnp_Params = {};
          vnp_Params["vnp_Version"] = "2.1.0";
          vnp_Params["vnp_Command"] = "pay";
          vnp_Params["vnp_TmnCode"] = tmnCode;
          // vnp_Params['vnp_Merchant'] = ''
          vnp_Params["vnp_Locale"] = locale;
          vnp_Params["vnp_CurrCode"] = currCode;
          vnp_Params["vnp_TxnRef"] = orderId;
          vnp_Params["vnp_OrderInfo"] = orderInfo;
          vnp_Params["vnp_OrderType"] = orderType;
          vnp_Params["vnp_Amount"] = amount * 100;
          vnp_Params["vnp_ReturnUrl"] = returnUrl;
          vnp_Params["vnp_IpAddr"] = ipAddr;
          vnp_Params["vnp_CreateDate"] = createDate;
          if (bankCode !== null && bankCode !== "") {
            vnp_Params["vnp_BankCode"] = bankCode;
          }
          vnp_Params = sortObject(vnp_Params);

          let querystring = require("qs");
          let signData = querystring.stringify(vnp_Params, { encode: false });
          let crypto = require("crypto");
          let hmac = crypto.createHmac("sha512", secretKey);
          let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
          vnp_Params["vnp_SecureHash"] = signed;
          vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
          const dataPayment = new Payment({
            invoice_id: invoice._id,
            bank_code: bankCode,
            transaction_no: orderId,
          });
          dataPayment.save();
          res.status(200).json({
            message: "create payment transaction successfully",
            url: vnpUrl,
            status: true,
          });
        }
      }
    }
  },
  async getPayment(req, res, next) {
    var vnp_Params = req.query;
    var secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    var secretKey = process.env.vnp_HashSecret;
    var querystring = require("qs");
    var signData = querystring.stringify(vnp_Params, { encode: false });
    var crypto = require("crypto");
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

    const invoice = await Payment.findOne({
      transaction_no: vnp_Params["vnp_TxnRef"],
    }).populate("invoice_id");
    await Invoice.findOneAndUpdate(
      { _id: invoice.invoice_id._id },
      { status: true }
    ).lean();
    // đã lấy được thông tin của hoá đơn, từ hoá đơn sẽ lấy ra thông tin phòng lúc này kiểm tra nếu trạng thái thanh toán thành công thì sẽ đặt lại trạng thái phòng thành đã thanh toán

    if (secureHash === signed) {
      var orderId = vnp_Params["vnp_TxnRef"];
      var rspCode = vnp_Params["vnp_ResponseCode"];
      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      if (rspCode !== "00") {
        res.json({
          status: "Faild to payment",
          response_code: rspCode,
        });
      } else {
        res.json({
          status: "success",
          message: "You have been successfully to payment for this room",
          order_id: orderId,
          response_code: rspCode,
        });
      }
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  },
};
