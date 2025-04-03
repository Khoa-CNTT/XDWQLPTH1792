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
    const hostel = await roomModel.getDetails(hostelId)
    if (!hostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Hostel not found')
    }
    return hostel
  } catch (error) {
    throw error
  }
}
export const roomService = {
  createNew,
  getDetails
}