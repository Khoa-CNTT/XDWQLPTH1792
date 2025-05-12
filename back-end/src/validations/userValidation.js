import Joi from 'joi'

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import {
  EMAIL_RULE, EMAIL_RULE_MESSAGE,
  PASSWORD_RULE, PASSWORD_RULE_MESSAGE,
  PHONE_NUMBER_RULE, CITIZEN_NUMBER,
  NUMBER_RULE_MESSAGE, CITIZEN_NUMBER_MESSAGE,
  DATE_RULE, DATE_RULE_MESSAGE
} from '~/utils/validators'
import { USER_ROLES } from '~/utils/constants'
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN, USER_ROLES.LANDLORD)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
const verifyAccount = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    token: Joi.string().required()
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
const login = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
const update = async (req, res, next) => {
  const correctCondition = Joi.object({ // biến tên điều kiện đúng
    displayName: Joi.string().trim().strict(),
    current_password: Joi.string().pattern(PASSWORD_RULE).message(`current_password:${PASSWORD_RULE_MESSAGE}`),
    new_password: Joi.string().pattern(PASSWORD_RULE).message(`new_password:${PASSWORD_RULE_MESSAGE}`),
    gender: Joi.string().valid('Nam', 'Nữ'),
    // dateOfBirth: Joi.date().less('now').greater('1-1-1920'),
    dateOfBirth: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE),
    phone: Joi.string().pattern(PHONE_NUMBER_RULE).message(NUMBER_RULE_MESSAGE),
    address: Joi.string().trim(),
    citizenId: Joi.string().pattern(CITIZEN_NUMBER).message(CITIZEN_NUMBER_MESSAGE)
  })
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false, allowUnknown: true })
    next()

  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))// console.log(error)
  }
}
export const userValidation = {
  createNew,
  verifyAccount,
  login,
  update
}