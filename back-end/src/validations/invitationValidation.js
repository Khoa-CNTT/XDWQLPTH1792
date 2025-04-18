import Joi from 'joi';
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
const createNewHostelInvitation = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    inviteeEmail: Joi.string().required(),
    hostelId: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }

}
export const invitationValidation = {
  createNewHostelInvitation
}