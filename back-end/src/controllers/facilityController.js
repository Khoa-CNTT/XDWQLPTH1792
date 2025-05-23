import { StatusCodes } from 'http-status-codes'
import { facilityService } from '~/services/facilityService'

const createNew = async (req, res, next) => {
  try {
    const result = await facilityService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const getAllFacilityByHostelId = async (req, res, next) => {
  try {
    const result = await facilityService.getAllFacilityByHostelId(req.query)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const deleteFacility = async (req, res, next) => {
  try {
    const id = req.params.id // Lấy dữ liệu từ query string
    const result = await facilityService.deleteFacility(id)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'Các mặt hàng này đã được xóa',
      deletedCount: result.deletedCount
    })
  } catch (error) {
    next(error)
  }
}
const updateFacility = async (req, res, next) => {
  try {
    const id = req.params.id // Lấy dữ liệu từ query string
    const result = await facilityService.updateFacility(id, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const facilityController = {
  createNew,
  getAllFacilityByHostelId,
  deleteFacility,
  updateFacility
}