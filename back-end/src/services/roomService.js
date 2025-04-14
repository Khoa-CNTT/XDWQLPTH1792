import { StatusCodes } from 'http-status-codes'
import { roomModel } from '~/models/roomModel'
import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const newRoom = {
      ...reqBody
    }
    const createdRoom = await roomModel.createNew(newRoom)
    const getNewRoom = await roomModel.findOneById(createdRoom.insertedId)
    //
    if (getNewRoom) {
      // Xử lý cấu trúc data trước khi trả dữ liệu về
      getNewRoom.bills = []
      getNewRoom.members = []
      // Cập nhật lại mảng columnOrderIds trong colecton boards
      await hostelModel.pushRoomOrderIds(getNewRoom)
    }
    return getNewRoom
  } catch (error) {
    throw error
  }
}
const getDetails = async (hostelId) => {
  try {
    const room = await roomModel.getDetails(hostelId)
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'room not found')
    }
    return room
  } catch (error) {
    throw error
  }
}
const deleteRooms = async (userId, ids) => {
  try {
    // Cập nhật lại mảng columnOrderIds trong colecton boards
    await hostelModel.deleteRoomOrderIds(userId, ids)
    const room = await roomModel.deleteRooms(ids)
    if (!room) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Room not found')
    }
    return room
  } catch (error) {
    throw error
  }
}
const update = async (roomId, reqBody) => {
  try {
    const updatedRoom = await roomModel.update(roomId, reqBody)
    return updatedRoom
  } catch (error) {
    throw error
  }
}
export const roomService = {
  createNew,
  getDetails,
  deleteRooms,
  update
}