const Invoice = require("../model/invoice");
const Room = require("../model/room");
const User = require("../model/user");
const Hostel = require("../model/hostel");
const sendEmail = require("../utils/nodemailer");
const { validYearMonth } = require("../utils/validation");
const { formatPrice } = require("../utils/cash");
const readXlsxFile = require("read-excel-file/node");
const roomForRent = require("../model/room_for_rent");

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
        other_service,
        user_id,
        date_month,
        total,
        status,
      } = req.body;
      const room = await Room.findById({ _id: room_id }).populate('hostel_id');
      const user = await User.findById({ _id: user_id });
      if (user !== null && room !== null) {
        const data = new Invoice({
          room_id,
          water_consumed_per_month,
          electricity_consumed_per_month,
          other_service,
          user_id,
          date_month,
          status,
          total,
        });
        const totalClient = calcualateTotal(
          electricity_consumed_per_month,
          water_consumed_per_month,
          room.hostel_id.price_water,
          room.hostel_id.price_electric,
          room.price,
          other_service
        );
        if (!validYearMonth(date_month)) {
          res.status(401).json({
            message: "Invalid date month, you must be a valid uear month",
          });
        }
        if (totalClient !== total) {
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
      } else {
        res.status(403).json({
          message: "User or Room not found",
          status: false,
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
      readXlsxFile(path).then(async (rows) => {
        rows.shift();
        const arr = rows;
        const HEADER = arr.shift();
        const DATA = arr;

        let idx = 0;
        const len = arr.length;
        const result = [];

        while (idx < len) {
          const length = DATA[idx].length;
          result.push({
            date: DATA[idx][0],
            hostel_name: DATA[idx][1],
            room_name: DATA[idx][2],
            water: DATA[idx][3],
            electric: DATA[idx][4],
            other: createOther(HEADER, DATA[idx]),
          });

          idx++;
        }
        function createOther(header, item) {
          let index = 0;
          const length = header.length;
          const other = [];

          while (index < length) {
            if (header[index] !== null) {
              other.push({
                name: header[index],
                price: item[index],
              });
            }

            index++;
          }

          return other;
        }

        for (rs of result) {
          const hostelFound = await Hostel.findOne({
            hostel_name: rs.hostel_name,
          }).populate("area_id");
          const roomFound = await Room.findOne({
            room_name: rs.room_name,
            hostel_id: hostelFound._id,
          });
          const roomRent = await roomForRent.findOne({
            room_id: roomFound._id,
          });
          if (roomRent !== null) {
            const dateFormat = new Date(rs.date).toLocaleDateString();
            const userFound = await Invoice.findOne({
              user_id: roomRent.user_id,
              date_month: rs.date,
            });
            const isInvoiced = await Invoice.findOne({ date_month: dateFormat.slice(2) }, { room_id: roomRent.room_id });
            if (isInvoiced) {
              res.status(402).json({
                message: "Invoice already exists",
                status: false,
              })
            } else {
              const dataToSave = new Invoice({
                room_id: roomFound._id,
                water_consumed_per_month: rs.water,
                electricity_consumed_per_month: rs.electric,
                water_price: hostelFound.price_water,
                electric_price: hostelFound.price_electric,
                other_service: rs.other,
                user_id: roomRent.user_id,
                date_month: dateFormat.slice(2),
                total: calcualateTotal(rs.electric, rs.water, hostelFound.price_electric, hostelFound.price_water, roomFound.price, rs.other),
                status: false,
              });
              if (!userFound) {
                await dataToSave.save();
                res.json({
                  data: dataToSave,
                  message: "Upload invoice successfuly",
                });
              } else {
                res.json({
                  message: "Some user has already in this month",
                  status: false,
                });
              }
            }
          }
        }
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
  async getInvoiceByUser(req, res, next) {
    try {
      const { user_id } = req.body;
      const response = await Invoice.find(({ user_id: user_id }));
      if (response.length !== 0) {
        res.status(200).json({
          status: 'success',
          data: response
        })
      } else {
        res.status(404).json({
          message: "No invoice found for user",
          status: false
        })
      }
    } catch (error) {
      res.status(400).json({
        message: "Error get invoice user",
        status: "Internal Server Error"
      })
    }
  }
};
