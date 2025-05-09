import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, MONTH_YEAR_RULE, MONTH_YEAR_RULE_MESSAGE } from '~/utils/validators'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    month: Joi.string().pattern(MONTH_YEAR_RULE).message(MONTH_YEAR_RULE_MESSAGE).required(),
    waterStart: Joi.number().required(),
    waterBegin: Joi.number().required(),
    electricStart: Joi.number().required(),
    electricBegin: Joi.number().required(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}
// const deleteRooms = async (req, res, next) => {
//   const correctCondition = Joi.object({ // biến tên điều kiện đúng
//     ids: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).required(),
//   })
//   try {
//     await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
//     next()

//   } catch (error) {
//     next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
//   }

// }
const update = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    month: Joi.string().pattern(MONTH_YEAR_RULE).message(MONTH_YEAR_RULE_MESSAGE),
    waterStart: Joi.number(),
    waterBegin: Joi.number(),
    electricStart: Joi.number(),
    electricBegin: Joi.number(),
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
export const utilityValidation = {
  createNew,
  // deleteRooms,
  update,
  // pullTenant
}