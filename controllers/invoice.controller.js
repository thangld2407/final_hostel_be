const Invoice = require("../model/invoice");
const Room = require("../model/room");
const User = require("../model/user");
const Hostel = require("../model/hostel");
const sendEmail = require("../utils/nodemailer");
const { validYearMonth } = require("../utils/validation");
const { formatPrice } = require("../utils/cash");
const readXlsxFile = require("read-excel-file/node");

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
  async uploadInvoiceByExcel(req, res, next) {
    try {
      if (!req.file) {
        return res
          .status(401)
          .json({ message: "Please upload an file excel about invoice." });
      }
      let path = req.file.path;
      readXlsxFile(path).then((rows) => {
        rows.shift();
        const header = rows.shift();
        function getOthers() {
          let initHeader = [];
          for (let i = 6; i < header.length - 1; i++) {
            initHeader.push(header[i]);
          }
          return initHeader;
        }

        function getData() {
          let data = [];
          console.log(rows.length);
          for (let i = 1; i <= rows.length; i++) {
            let tmp = rows[i].length - 1;
            data.push({
              hostel_name: rows[i][0],
              room_name: rows[i][1],
              water: rows[i][2],
              electric: rows[i][3],
              price_water: rows[i][4],
              price_electric: rows[i][5],
              // other: getOthers(),
              total: rows[i][11],

              // GET LẠI OTHER SERVICE
            });
          }
          return data;
        }
        // rows.forEach((col, index) => {
        //   let invoice = {
        //     hostel_name: col[0],
        //     room_name: col[1],
        //     water: col[2],
        //     electric: col[3],
        //     price_water: col[4],
        //     price_electric: col[5],
        //     other: getData(),
        //     total: col.lenght - 1,
        //   };
        //
        //   invoices.push(invoice);
        // });
        res.json({
          data: getData(),
        });
        invoices.map(async (item) => {
          try {
            const hostel = await Hostel.findOne({ name: item.hostel_name });
            // console.log(hostel);
          } catch (error) {
            console.log(error);
          }
        });
        // res.status(200).json({
        //   data: invoices,
        // });
      });
    } catch (error) {
      res.status(500).json({ message: "ERROR UPLOAD FILE SYSERROR" });
    }
  },
  async updateInvoice(req, res, next) {
    const id = req.body.invoice_id;
    const newData = { ...req.body, status: req.body.status };
    const options = { new: true };
    const isId = await Invoice.findById(id);
    if (!isId) {
      res.status(401).json({
        message: "Invoice not found",
      });
    } else {
      await Invoice.findByIdAndUpdate(id, newData, options);
      res.status(200).json({
        message: "Invoice updated",
      });
    }
  },
};
