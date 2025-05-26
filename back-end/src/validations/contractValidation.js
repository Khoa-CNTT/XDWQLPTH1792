import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, DATE_RULE, DATE_RULE_MESSAGE } from '~/utils/validators'
import { CONSTRACT_STATUS } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    contractName: Joi.string().min(3).max(50).trim().strict(),
    content: Joi.string().min(3).trim().strict(),
    dateStart: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE).required(),
    dateEnd: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE).required(),
    deposit: Joi.number().required(),
    roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    tenantId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false }) // trả về tất cả các lỗi, còn trả về lỗi đầu tiên thì true
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}
const update = async (req, res, next) => {
  // Lưu ý không required trong trường hợp update
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    contractName: Joi.string().min(3).max(50).trim().strict(),
    content: Joi.string().min(3).trim().strict(),
    dateStart: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE),
    dateEnd: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE),
    deposit: Joi.number()
  })
  try {

    //chỉ định abortEarly: false để trường hợp có nhiều lỗi valication thì trả về tất cả lỗi
    // Đối với trường hợp update cho phép Unknown để đẩy lên một số fied lên
    await correctCondition.validateAsync(req.bod, {
      abortEarly: false,
      allowUnknown: true // cho phép request truyền đi trư��ng nào c��ng được
    })
    //validate dữ liệu xong xuôi hợp lệ thì cho request đi tiêp sang Controller
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
export const contractValidation = {
  createNew,
  update
}