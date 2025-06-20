import { StatusCodes } from 'http-status-codes'
import { roomService } from '~/services/roomService'

const createNew = async (req, res, next) => {
  try {
    // console.log('req.body=', req.body)
    // console.log('req.query=', req.query)
    // console.log('req.params=', req.params)
    const createRoom = await roomService.createNew(req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.CREATED).json(createRoom)
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
    const hostel = await roomService.getDetails(hostelId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(hostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const deleteRooms = async (req, res, next) => {
  try {
    const ids = req.query.ids // Lấy dữ liệu từ query string
    const result = await roomService.deleteRooms(ids)
    console.log('roomiD', ids)
    console.log('type', typeof ids)

    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'Rooms deleted successfully',
      deletedCount: result.deletedCount
    })
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const update = async (req, res, next) => {
  try {
    // console.log('req.params=', req.params)
    const roomId = req.params.id
    const data = req.body // Lấy dữ liệu từ query string
    const result = await roomService.update(roomId, data)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const pullTenant = async (req, res, next) => {
  try {
    const data = req.body // Lấy dữ liệu từ query string
    const result = await roomService.pullTenant(data)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}

export const roomController = {
  createNew,
  getDetails,
  deleteRooms,
  update,
  pullTenant
}