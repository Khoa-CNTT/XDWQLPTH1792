
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { facilityModel } from '~/models/facilityModel'
import { roomModel } from '~/models/roomModel'
const createNew = async (data) => {
  try {
    const { roomId, facilityName } = data
    const isHasFacility = await facilityModel.findOneByData({ roomId, facilityName })
    if (isHasFacility) {
      throw new ApiError(StatusCodes.CONFLICT, 'Đã tồn tại đồ này trong phòng')
    }
    const createdFac = await facilityModel.createNew(data)
    const result = await facilityModel.findOneById(createdFac.insertedId)
    await roomModel.pushUtility(roomId, result.facilityName)
    return result
  } catch (error) {
    throw error
  }
}
const getAllFacilityByHostelId = async (data) => {
  try {
    const { hostelId } = data
    const facilities = await facilityModel.getAllFacilityByHostelId(hostelId)
    return facilities
  } catch (error) {
    throw error
  }
}
const deleteFacility = async (id) => {
  try {
    const isHasFacility = await facilityModel.findOneById(id)
    if (!isHasFacility) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Mặt hàng này không tìm thấy')
    }
    await roomModel.pullFacilityInRoom(isHasFacility.roomId, isHasFacility.facilityName)
    const result = await facilityModel.deleteFacility(id)
    return result
  } catch (error) {
    throw error
  }
}
const updateFacility = async (id, data) => {
  try {
    await roomModel.pullFacilityInRoom(data.roomId, data.facilityName)
    const result = await facilityModel.update(id, data)
    await roomModel.pushUtility(result.roomId, result.facilityName)
    return result
  } catch (error) {
    throw error
  }
}
export const facilityService = {
  createNew,
  getAllFacilityByHostelId,
  deleteFacility,
  updateFacility
}