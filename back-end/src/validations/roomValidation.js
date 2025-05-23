import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { STATUS_ROOM } from '~/utils/constants'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    roomName: Joi.string().required().max(50).trim(),
    length: Joi.number().required(),
    width: Joi.number().required(),
    price: Joi.number().required(),
    images: Joi.string().required().messages({
      'any.required': 'Image is required',
      'string.empty': 'Image must not be an empty string'
    })
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}
const deleteRooms = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    ids: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}
const update = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    roomName: Joi.string().max(50).trim().strict(),
    length: Joi.number(),
    width: Joi.number(),
    price: Joi.number(),
    images: Joi.string().messages({
      'any.required': 'Image is required',
      'string.empty': 'Image must not be an empty string'
    }),
    status: Joi.string().valid(STATUS_ROOM.AVAILABLE, STATUS_ROOM.OCCUPIED, STATUS_ROOM.MAINTENANCE),
    tenantId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    hostelId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
const pullTenant = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    roomId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    tenantId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
export const roomValidation = {
  createNew,
  deleteRooms,
  update,
  pullTenant
}