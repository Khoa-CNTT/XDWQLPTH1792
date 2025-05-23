import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { REQUETS_STATUS } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().required().trim().strict(),
    image: Joi.string().required().messages({
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
const update = async (req, res, next) => {
  // Lưu ý không required trong trường hợp update
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    status: Joi.string().required().valid(...Object.values(REQUETS_STATUS))
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
export const requestValidation = {
  createNew,
  update
}