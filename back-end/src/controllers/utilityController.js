import { StatusCodes } from 'http-status-codes'
import { utilityService } from '~/services/utilityService'

const createNew = async (req, res, next) => {
  try {
    const createHostel = await utilityService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createHostel)
  } catch (error) {
    next(error)
  }
}
const getDetails = async (req, res, next) => {
  try {
    const hostelId = req.params.id
    const hostel = await utilityService.getDetails(hostelId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(hostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const getUtilitiesByHostelId = async (req, res, next) => {
  try {
    const { hostelId } = req.query
    const hostel = await utilityService.getUtilitiesByHostelId(hostelId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(hostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const deleteUtilities = async (req, res, next) => {
  try {

    const ids = req.query.ids // Lấy dữ liệu từ query string
    const result = await utilityService.deleteUtilities(ids)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'utilitys deleted successfully',
      deletedCount: result.deletedCount
    })
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const update = async (req, res, next) => {
  try {
    console.log('data=', req.body)
    const utilityId = req.params.id
    console.log('req.params=', utilityId)
    const result = await utilityService.update(utilityId, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}

export const utilityController = {
  createNew,
  getUtilitiesByHostelId,
  // getDetails,
  deleteUtilities,
  update
}