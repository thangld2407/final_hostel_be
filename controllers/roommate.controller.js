const User = require('../model/user')
const RoomRent = require('../model/room_for_rent')
module.exports = {
  async addRoomMate(req, res, next) {
    try {
      const { user, room_id } = req.body;
      let roomate = [];
      if (user.length > 0 && room_id) {
        for (let i of user) {
          if (i !== "") {
            let userFound = await User.findById(i, '-password -__v',);
            roomate.push(userFound)
          } else {
            res.status(403).json({
              status: false,
              message: "User not found or invalid",
            })
          }
        }
        const isRoomRent = await RoomRent.findOne({ room_id: room_id }).lean();
        if (isRoomRent) {
          await RoomRent.findOneAndUpdate({ room_id: room_id }, { room_mate: roomate });
          res.status(200).json({
            message: 'Add room mate successfully',
            status: true,
          })
        } else {
          res.status(403).json({
            status: false,
            message: "Room not found in room rent"
          })
        }
      } else {
        res.status(404).json({
          message: 'You must be send user_id and room_id ',
          status: false,
        })
      }
    } catch (error) {
      res.status(404).json({
        message: "ERROR ROOM MATE ",
        status: false,
      })
    }
  }
}