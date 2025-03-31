import { StatusCodes } from 'http-status-codes'
import { hostelService } from '~/services/hostelService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body=', req.body)
    // console.log('req.query=', req.query)
    // console.log('req.params=', req.params)
    const createHostel = await hostelService.createNew(req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.CREATED).json(createHostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
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
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}

export const hostelController = {
  createNew,
  getDetails
}