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

const update = async (req, res, next) => {
  try {
    const billId = req.params.id
    const result = await billService.update(billId, req.body)
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

export const billController = {
  createNew,
  update
}