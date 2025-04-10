import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { HOSTEL_TYPES } from '~/utils/constants'

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelName: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required': 'Name is required ',
      'string.empty': 'Name is not allowed to be empty',
      'string.min': 'Name length must be at least 3 characters long',
      'string.max': 'Name length must be less than or equal to 5 characters long',
      'string.trim': 'Name must not have leading or trailing whitespace'
    }),
    address: Joi.string().required().min(3).max(50).trim().strict(),
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
const update = async (req, res, next) => {
  // Lưu ý không required trong trường hợp update
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    hostelName: Joi.string().min(3).max(50).trim().strict(),
    address: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.string().valid(HOSTEL_TYPES.PUBLIC, HOSTEL_TYPES.PRIVATE)
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
export const hostelValidation = {
  createNew,
  update
}