import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { FACILITY_CONDITION } from '~/utils/constants';

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    facilityName: Joi.string().required().min(3).max(50).trim().strict(),
    number: Joi.number().required()
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
    roomId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    facilityName: Joi.string().min(3).max(50).trim().strict(),
    number: Joi.number(),
    condition: Joi.string().valid(...Object.values(FACILITY_CONDITION)).default(FACILITY_CONDITION.GOOD),
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
export const facilityValidation = {
  createNew,
  update
}