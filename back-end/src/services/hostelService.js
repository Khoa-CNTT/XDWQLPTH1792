import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/Cloudinary'
import { roomModel } from '~/models/roomModel'

const createNew = async (userId, reqBody) => {
  try {
    const createdHostel = await hostelModel.createNew(userId, reqBody)
    //lấy bản ghi hostel sau khi gọi(Tùy vào dự án mà bước này có cần gọi  hay không)
    const getNewHostel = await hostelModel.findOneById(createdHostel.insertedId)
    return getNewHostel
  } catch (error) {
    throw error
  }
}
const getDetails = async (hostelId) => {
  try {
    const hostel = await hostelModel.getDetails(hostelId)
    if (!hostel) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Hostel not found')
    }
    return hostel
  } catch (error) {
    throw error
  }
}

const uploadImages = async (userAvatarFile) => {
  try {
    // Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
    const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'hostels')
    return uploadResult.secure_url
  } catch (error) {
    throw error
  }
}
const getHostels = async (userId) => {
  try {
    const hostel = await hostelModel.getHostels(userId)
    return hostel
  } catch (error) {
    throw error
  }
}
const getHostelsPublic = async () => {
  try {
    const find = {
      type: 'public'
    }
    const hostel = await hostelModel.getHostelsPublic(find)
    return hostel
  } catch (error) {
    throw error
  }
}

const update = async (hostelId, reqBody) => {
  try {
    if (reqBody.tenantId) {
      const getHostel = await hostelModel.findOneById(hostelId)
      const hostelDetail = await hostelModel.getDetails(hostelId)
      const isInRoom = hostelDetail.rooms.some(room =>
        room.memberIds.map(id => id.toString()).includes(reqBody.tenantId)
      )
      if (isInRoom) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Khách đã tồn tại trong phòng trọ nào đó. Hãy xóa khách ở phòng mới được xóa khỏi nhà trọ!')
      }
      const tenantIds = getHostel.tenantIds.filter(id => id.toString() !== reqBody.tenantId)
      return await hostelModel.update(hostelId, { tenantIds })
    }
    const updatedBoard = await hostelModel.update(hostelId, reqBody)
    return updatedBoard
  } catch (error) {
    throw error
  }
}
const deleteHostel = async (userId, ids) => {
  try {
    // Lấy danh sách các hostels dựa trên `ids` và `userId`
    const hostels = await Promise.all(
      ids.map(async (id) => {
        return await hostelModel.findOneById(id) // Hàm này sẽ lấy hostel theo `id` và `userId`
      })
    )
    // Gộp tất cả `roomIds` từ các hostels
    const allRoomIds = hostels.flatMap((hostel) => hostel.roomIds || [])
    if (allRoomIds.length > 0) {
      await roomModel.deleteRooms(allRoomIds)
    }
    const updatedBoard = await hostelModel.deleteHostel(userId, ids)
    return updatedBoard
  } catch (error) {
    throw error
  }
}
const findHostels = async (reqBody) => {
  try {
    // Lấy danh sách các hostels dựa trên `ids` và `userId`
    const dataFind = {
      ...reqBody,
      type: 'public'
    }
    const updatedBoard = await hostelModel.getHostelsPublic(dataFind)
    return updatedBoard
  } catch (error) {
    throw error
  }
}
export const hostelService = {
  createNew,
  getDetails,
  uploadImages,
  getHostels,
  update,
  deleteHostel,
  getHostelsPublic,
  findHostels
}