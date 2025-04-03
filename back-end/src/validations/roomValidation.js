import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const STATUS_ROOM = {
  EMPTY: 'empty',
  OCCUPIED: 'occupied', //Đã thuê
  RESERVED: 'reserved' // đã đặt cọc
}
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    roomName: Joi.string().required().max(50).trim().strict(),
    length: Joi.number().required(),
    width: Joi.number().required(),
    utilities: Joi.string().max(50).trim().strict(),
    price: Joi.number().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}

export const roomValidation = {
  createNew
}