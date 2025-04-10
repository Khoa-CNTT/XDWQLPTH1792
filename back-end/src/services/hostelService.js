import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/Cloudinary'

const createNew = async (userId, reqBody) => {
  try {
    console.log('req.body=', reqBody)
    const createdHostel = await hostelModel.createNew(userId, reqBody)
    console.log('createdHostel', createdHostel)
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
    console.log('uploadResult:', uploadResult)
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

const update = async (hostelId, reqBody) => {
  try {
    const updatedBoard = await hostelModel.update(hostelId, reqBody)
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
  update
}