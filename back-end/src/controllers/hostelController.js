import { StatusCodes } from 'http-status-codes'
import { hostelService } from '~/services/hostelService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const createHostel = await hostelService.createNew(userId, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.CREATED).json(createHostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const getDetails = async (req, res, next) => {
  try {
    // console.log('req.params=', req.params)
    const hostelId = req.params.id
    const hostel = await hostelService.getDetails(hostelId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(hostel)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const uploadImages = async (req, res, next) => {
  const userAvatarFile = req.file
  const uploadResult = await hostelService.uploadImages(userAvatarFile)
  res.status(StatusCodes.OK).json(uploadResult)
}
const getHostels = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const results = await hostelService.getHostels(userId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}
const getHostelsByOwnerId = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    console.log(userId)
    const results = await hostelService.getHostelsByOwnerId(userId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}
const getHostelsPublic = async (req, res, next) => {
  try {
    const results = await hostelService.getHostelsPublic()
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    // Chỉ lấy hostel thuộc về user nào đó thôi
    const updatedHostel = await hostelService.update(hostelId, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(updatedHostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
  }
}
const deleteHostel = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const ids = req.query.ids // Lấy dữ liệu từ query string
    // Chỉ lấy board thuộc về user nào đó thôi
    const result = await hostelService.deleteHostel(userId, ids)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'Nhà trọ đã xóa thành công',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const findHostels = async (req, res, next) => {
  try {
    const result = await hostelService.findHostels(req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
export const hostelController = {
  createNew,
  getDetails,
  uploadImages,
  getHostels,
  update,
  deleteHostel,
  getHostelsPublic,
  findHostels,
  getHostelsByOwnerId
}