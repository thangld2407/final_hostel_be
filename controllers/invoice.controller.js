const Invoice = require("../model/invoice");
const Room = require("../model/room");
const User = require("../model/user");
const sendEmail = require("../utils/nodemailer");
const { validYearMonth } = require("../utils/validation");
const { formatPrice } = require("../utils/cash");

function calcualateTotalService(array) {
  const sum = array.reduce((acc, currentValue, currentIndex, arr) => {
    return acc + currentValue.price;
  }, 0);
  return sum;
}
function calcualateTotal(e, w, pe, pw, pr, other_service) {
  const totalService = calcualateTotalService(other_service);
  const totalPrice = pr + e * pe + pw * w + totalService;
  return totalPrice;
}

module.exports = {
  getAllInvoice(req, res, next) {
    Invoice.find()
      .then((rs) => {
        res.status(200).json({
          message: "get all invoice successfully",
          data: rs,
        });
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  },
  async createNewInvoice(req, res, next) {
    try {
      const {
        room_id,
        water_consumed_per_month,
        electricity_consumed_per_month,
        water_price,
        electric_price,
        other_service,
        user_id,
        date_month,
        total,
        status,
      } = req.body;
      const data = new Invoice({
        room_id,
        water_consumed_per_month,
        electricity_consumed_per_month,
        water_price,
        electric_price,
        other_service,
        user_id,
        date_month,
        status,
        total,
      });
      const room = await Room.findById(room_id);
      const user = await User.findById(user_id);
      const totalClient = calcualateTotal(
        electricity_consumed_per_month,
        water_consumed_per_month,
        electric_price,
        water_price,
        room.price,
        other_service
      );

      if (!validYearMonth(date_month)) {
        res.status(401).json({
          message: "Invalid date month, you must be a valid uear month",
        });
      }
      if (totalClient !== total) {
        console.log(totalClient, "client");
        console.log(total, "Server");
        res.status(403).json({
          message: "Please calculate again total before continuing",
        });
      } else {
        const result = await data.save();
        res.status(200).json({
          message: "successfully to creata new invoice",
          data: {
            invoice: result,
            room: room,
          },
        });
        console.log(user);
        sendEmail({
          email: user.email,
          subject: `Thông báo đóng tiền phòng tháng ${result.date_month}`,
          html: `
          <head>
          <style>
          *{
            margin:0;
            padding:0;
          }
          table {
            width:100%;
            border: 1px solid #333;
            border-collapse: collapse;
            text-align: left;
            color: #333;
          }
          tr {
            border: 1px solid #333;
          }
          
          td {
            background-color: #9fb4ff;
          }
        
          </style>

          </head>
        <table>
        <thead></thead>
        <tbody>
          <tr>
            <td>RoomNo</td>
            <td>${room.room_name}</td>
          </tr>
          <tr>
            <td>Price(VND)</td>
            <td>${formatPrice(room.price)}</td>
          </tr>
          <tr>
            <td>Water Used(M3)</td>
            <td>${result.water_consumed_per_month}</td>
          </tr>
          <tr>
            <td>Electric Used(KW)</td>
            <td>${result.electricity_consumed_per_month}</td>
          </tr>
          <tr>
            <td>Other Services(VND)</td>
            <td>${formatPrice(
              calcualateTotalService(result.other_service)
            )}</td>
          </tr>
          <tr>
            <td>Total(VND)</td>
            <td>${formatPrice(result.total)}</td>
          </tr>
        </tbody>
      </table>
          `,
        });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: error });
    }
  },
  async updateInvoice(req, res, next) {
    const id = req.body.invoice.id;
    const { status } = req.body;
    const optiosn = { new: true };
  },
};
