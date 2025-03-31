import { StatusCodes } from 'http-status-codes'
import { hostelModel } from '~/models/hostelModel'
import ApiError from '~/utils/ApiError'

const createNew = async (reqBody) => {
  try {
    console.log('req.body=', reqBody)
    const createdHostel = await hostelModel.createNew(reqBody)
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
export const hostelService = {
  createNew,
  getDetails
}