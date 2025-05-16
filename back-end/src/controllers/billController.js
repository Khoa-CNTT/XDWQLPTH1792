import { StatusCodes } from 'http-status-codes'
import { billService } from '~/services/billService'

const createNew = async (req, res, next) => {
  try {
    const createHostel = await billService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createHostel)
  } catch (error) {
    next(error)
  }
}
const getBillsByRoomId = async (req, res, next) => {
  try {
    const createHostel = await billService.getBillsByRoomId(req.query)
    res.status(StatusCodes.CREATED).json(createHostel)
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const billId = req.params.id
    const result = await billService.update(billId, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const deleteBill = async (req, res, next) => {
  try {
    const data = req.query
    await billService.deleteBill(data)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'Hóa đơn đã xóa thành công'
    })
  } catch (error) {
    next(error)
  }
}

export const billController = {
  createNew,
  update,
  getBillsByRoomId,
  deleteBill
}