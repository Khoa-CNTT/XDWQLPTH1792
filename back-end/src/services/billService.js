import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import { billModel } from '~/models/billsModel'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { utilityModel } from '~/models/utilityModel'

const createNew = async (reqBody) => {
  try {
    const data = {
      utilityId: reqBody.utilityId
    }
    const isHasBill = await billModel.getDetails(data)
    if (isHasBill.length > 0) {
      throw new ApiError(StatusCodes.CONFLICT, 'Hóa đơn này đã được tạo')
    }
    const detailRoom = await roomModel.findOneById(reqBody.roomId)
    const detailUtility = await utilityModel.findOneById(reqBody.utilityId)
    const dataBill = {
      ...reqBody,
      totalAmount: detailRoom.price + detailUtility.toltalUtility + reqBody.extraFees
    }
    const createdbill = await billModel.createNew(dataBill)
    const getNewbill = await billModel.findOneById(createdbill.insertedId)
    return getNewbill
  } catch (error) {
    throw error
  }
}
const update = async (billId, reqBody) => {
  try {
    const detailHostel = await hostelModel.findOneById(reqBody.hostelId)
    const updateData = {
      ...reqBody,
      waterStart: Number(reqBody.waterStart),
      waterBegin: Number(reqBody.waterBegin),
      electricStart: Number(reqBody.electricStart),
      electricBegin: Number(reqBody.electricBegin),
      toltalbill: (reqBody.waterBegin - reqBody.waterStart) * detailHostel.water_price + (reqBody.electricBegin - reqBody.electricStart) * detailHostel.electricity_price,
      updateAt: Date.now()
    }
    delete updateData.hostelId
    const updatedbill = await billModel.update(billId, updateData)
    return updatedbill
  } catch (error) {
    throw error
  }
}
export const billService = {
  createNew,
  update
}