import { StatusCodes } from 'http-status-codes'
import { roomModel } from '~/models/roomModel'
import { hostelModel } from '~/models/hostelModel'
import { STATUS_ROOM } from '~/utils/constants'
import ApiError from '~/utils/ApiError'
import { utilityModel } from '~/models/utilityModel'
import { facilityModel } from '~/models/facilityModel'

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
const deleteRooms = async (ids) => {
  try {
    // Cập nhật lại mảng columnOrderIds trong colecton boards
    await hostelModel.deleteRoomOrderIds(ids)
    await utilityModel.deleteUtilitiesByRoomIds(ids)
    await facilityModel.deleteFacilityByRoomIds(ids)
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
    if (reqBody.tenantId) {
      const roomDetail = await roomModel.findOneById(roomId)
      if (roomDetail.memberIds.map(id => id.toString()).includes(reqBody.tenantId.toString())) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Khách đã ở trong phòng này rồi !')
      }
      const rooms = await roomModel.getRoomsByHostelId(reqBody.hostelId)
      // Kiểm tra từng phòng xem tenantId đã có trong memberIds của phòng nào chưa
      for (let room of rooms) {
        if (room.memberIds.map(id => id.toString()).includes(reqBody.tenantId.toString())) {
          throw new ApiError(StatusCodes.BAD_REQUEST, 'Khách đã ở trong một phòng nào đó của nhà trọ này!')
        }
      }
      if (roomDetail.status !== STATUS_ROOM.OCCUPIED) {
        await roomModel.update(roomId, { status: STATUS_ROOM.OCCUPIED })
      }
      const pushTenantToRoom = await roomModel.pushMembers(roomId, reqBody.tenantId)
      return pushTenantToRoom
    }
    const updatedRoom = await roomModel.update(roomId, reqBody)
    return updatedRoom
  } catch (error) {
    throw error
  }
}
const pullTenant = async (reqBody) => {
  try {
    const { roomId, tenantId } = reqBody
    const getRoom = await roomModel.findOneById(roomId)
    const memberIds = getRoom.memberIds.filter(id => id.toString() !== tenantId)
    const result = await roomModel.update(roomId, { memberIds })
    console.log('result', result)
    if (result.memberIds.length === 0 ) {
      return await roomModel.update(roomId, { status: STATUS_ROOM.AVAILABLE })
    }
    return result
  } catch (error) {
    throw error
  }
}
export const roomService = {
  createNew,
  getDetails,
  deleteRooms,
  update,
  pullTenant
}