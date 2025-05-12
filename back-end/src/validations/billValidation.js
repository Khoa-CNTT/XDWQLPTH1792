import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE} from '~/utils/validators'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    utilityId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    expenseTitle: Joi.number().required(),
    extraFees: Joi.number().required()
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
    expenseTitle: Joi.number().required(),
    extraFees: Joi.number().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
export const billValidation = {
  createNew,
  // deleteRooms,
  update,
  // pullTenant
}