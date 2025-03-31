/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PHONE_NUMBER_RULE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'


const HOSTEL_COLLECTION_NAME = 'Hostel'
const HOSTEL_COLLECTION_SCHEMA = Joi.object({
  hostelName: Joi.string().required().min(3).max(50).trim().strict(),
  address: Joi.string().required().min(3).max(50).trim().strict(),
  phone: Joi.string().required().pattern(PHONE_NUMBER_RULE).min(9).max(10).trim().strict(),
  roomOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
})
const validateBeforeCreate = async (data) => {
  return await HOSTEL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async ( data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    console.log('valiData', valiData)
    const createdBoard = await GET_DB().collection(HOSTEL_COLLECTION_NAME).insertOne(valiData)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id) => {
  try {
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const hostelModel = {
  createNew,
  findOneById,
  getDetails
}