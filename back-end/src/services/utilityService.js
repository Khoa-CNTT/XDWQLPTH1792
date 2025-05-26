import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import { utilityModel } from '~/models/utilityModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    const data = {
      roomId: reqBody.roomId,
      month: reqBody.month
    }
    const isHasUtility = await utilityModel.getUtilities(data)
    if (isHasUtility.length > 0) {
      throw new ApiError(StatusCodes.CONFLICT, 'Tiện ích của phòng đã được tạo trong tháng này ')
    }
    const detailHostel = await hostelModel.findOneById(reqBody.hostelId)
    const dataUtility = {
      ...reqBody,
      toltalUtility: (reqBody.waterEnd - reqBody.waterStart) * detailHostel.water_price + (reqBody.electricEnd - reqBody.electricStart) * detailHostel.electricity_price
    }
    const createdUtility = await utilityModel.createNew(dataUtility)
    const getNewUtility = await utilityModel.findOneById(createdUtility.insertedId)
    return getNewUtility
  } catch (error) {
    throw error
  }
}
const getUtilitiesByHostelId = async (data) => {
  try {
    const result = await utilityModel.getUtilities(data)
    const res = result.map(u => ({
      ...u,
      roomInfo: u.roomInfo[0],
      hostelInfo: u.hostelInfo[0]
    }))
    return res
  } catch (error) {
    throw error
  }
}
const deleteUtilities = async (ids) => {
  try {
    const utilities = await utilityModel.deleteUtilities(ids)
    if (!utilities) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tiện ích không tìm thấy')
    }
    return utilities
  } catch (error) {
    throw error
  }
}
const update = async (utilityId, reqBody) => {
  try {
    const detailHostel = await hostelModel.findOneById(reqBody.hostelId)
    const updateData = {
      ...reqBody,
      waterStart: Number(reqBody.waterStart),
      waterEnd: Number(reqBody.waterEnd),
      electricStart: Number(reqBody.electricStart),
      electricEnd: Number(reqBody.electricEnd),
      toltalUtility: (Number(reqBody.waterEnd) - Number(reqBody.waterStart)) * detailHostel.water_price + (reqBody.electricEnd - reqBody.electricStart) * detailHostel.electricity_price,
      updateAt: Date.now()
    }
    delete updateData.hostelId
    const updatedUtility = await utilityModel.update(utilityId, updateData)
    return updatedUtility
  } catch (error) {
    throw error
  }
}
export const utilityService = {
  createNew,
  getUtilitiesByHostelId,
  // getDetails,
  deleteUtilities,
  update
}