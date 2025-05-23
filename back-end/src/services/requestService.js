import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { pickUser } from '~/utils/formmasters'
import { REQUETS_STATUS } from '~/utils/constants'
import { userModel } from '~/models/userModel'
import { requestModel } from '~/models/requestModel'
import { roomModel } from '~/models/roomModel'
const createNew = async (reqBody, tenantId) => {
  try {

    // Tìm luôn cái hostel để lấy data xử lý
    const hostel = await hostelModel.findOneById(reqBody.hostelId)
    const room = await roomModel.findOneById(reqBody.roomId)
    // Nếu không tồn tại 1 trong 3 cứ thẳng tay reject
    if (!room || !hostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tồn tại nhà trọ hoặc phòng trọ')
    }
    const newRequestData = {
      ...reqBody,
      tenantId,
      type: 'REPAIR_REQUEST',
      status: REQUETS_STATUS.PENDING //Default status là PENDING
    }

    // Gọi sang model để lưu vào DB
    const createNewRequest = await requestModel.createNewRepairRequest(newRequestData)
    const getRequest = await requestModel.findOneById(createNewRequest.insertedId)
    return getRequest
  } catch (error) {
    throw error
  }
}

const getRequests = async (data) => {
  try {
    const getRequests = await requestModel.getRequests(data)
    // Vì dữ liệu inviter, invitee, hostelId là đang ở giá trị mảng 1 phần tử nếu lấy ra được nên  chùng ta biến đổi nó
    //  vê Json Objecttrước khi trả về
    const resRequests = getRequests.map(i => ({
      ...i,
      tenant: i.tenant[0] || {},
      room: i.room[0] || {},
      hostel: i.hostel[0] || {}
    }
    ))


    return resRequests
  } catch (error) {
    throw error
  }
}
const updateRequest = async (userId, requestId, status) => {
  try {
    console.log('userId', userId)
    console.log('requestId', requestId)
    console.log('status', status)
    const getRequest = await requestModel.findOneById(requestId)
    if (!getRequest) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Yêu cầu không tìm thấy')
    }
    // Sau khi có Request rôi thì lấy thông tin của hostel
    const hostelId = getRequest.hostelId
    const getHostel = await hostelModel.findOneById(hostelId)
    if (!getHostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Nhà trọ không tìm thấy')
    }
    if (getHostel.ownerId.toString() !== userId) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Bạn không có quyền cập nhật yêu cầu này')
    // Bước 1: cập nhật lại status trong bản ghi Request
    const updatedRequest = await requestModel.update(requestId, status)
    return updatedRequest
  } catch (error) {
    throw error
  }
}
export const requestService = {
  createNew,
  getRequests,
  updateRequest
}