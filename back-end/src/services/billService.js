import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import { billModel } from '~/models/billsModel'
import ApiError from '~/utils/ApiError'
import { roomModel } from '~/models/roomModel'
import { utilityModel } from '~/models/utilityModel'
import { BILL_STATUS } from '~/utils/constants'

const createNew = async (reqBody) => {
  try {
    const data = {
      utilityId: reqBody.utilityId
    }
    const isHasBill = await billModel.getDetails(data)
    if (isHasBill?.length > 0) {
      throw new ApiError(StatusCodes.CONFLICT, 'Hóa đơn này đã được tạo')
    }
    const detailRoom = await roomModel.findOneById(reqBody.roomId)
    const detailUtility = await utilityModel.findOneById(reqBody.utilityId)
    if (detailUtility.roomId.toString() !== detailRoom._id.toString()) {
      throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Tiện ích này không trùng với phòng')
    }
    const dataBill = {
      ...reqBody,
      totalAmount: detailRoom.price + detailUtility.toltalUtility + Number(reqBody.extraFees)
    }
    const createdbill = await billModel.createNew(dataBill)
    const getNewBill = await billModel.findOneById(createdbill.insertedId)
    await roomModel.pushBillIds(detailRoom._id, getNewBill._id)
    return getNewBill
  } catch (error) {
    throw error
  }
}
const update = async (billId, reqBody) => {
  try {
    const detailBill = await billModel.findOneById(billId)
    if (detailBill.status === BILL_STATUS.SUCCESS) {
      throw new ApiError(StatusCodes.CONFLICT, 'Hóa đơn này đã thanh toán, không thể cập  nhật')
    }
    const updatedbill = await billModel.update(billId, reqBody)
    return updatedbill
  } catch (error) {
    throw error
  }
}
const getBillsByRoomId = async (data) => {
  try {
    const updatedBill = await billModel.getDetails(data)
    const result = updatedBill.map(u => ({
      ...u,
      roomInfo: u.roomInfo[0],
      hostelInfo: u.hostelInfo[0],
      utilityInfo: u.utilityInfo[0]
    }))
    return result
  } catch (error) {
    throw error
  }
}
const deleteBill = async (data) => {
  try {
    const { billId, roomId } = data
    await roomModel.deleteBillIds(roomId, billId)
    const result = billModel.deleteBill(billId)
    return result
  } catch (error) {
    throw error
  }
}
export const billService = {
  createNew,
  update,
  getBillsByRoomId,
  deleteBill
}