/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PHONE_NUMBER_RULE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'

const STATUS_ROOM = {
  EMPTY: 'Trống',
  OCCUPIED: 'Đã thuê', //Đã thuê
  RESERVED: 'Đã đặt cọc' // đã đặt cọc
}
const ROOM_COLLECTION_NAME = 'rooms'
const ROOM_COLLECTION_SCHEMA = Joi.object({
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomName: Joi.string().required().max(50).trim().strict(),
  length: Joi.number().required(),
  width: Joi.number().required(),
  utilities: Joi.string().max(50).trim().strict(),
  memberOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  billOrderIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  imagesOfRoom: Joi.array().items(Joi.string()).default([]),
  status: Joi.string().valid(STATUS_ROOM.EMPTY, STATUS_ROOM.OCCUPIED, STATUS_ROOM.RESERVED).default(STATUS_ROOM.EMPTY),
  price: Joi.number().required()
})
const validateBeforeCreate = async (data) => {
  return await ROOM_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newRoomToAdd = {
      ...valiData,
      hostelId: new ObjectId(valiData.hostelId)
    }
    const createdBoard = await GET_DB().collection(ROOM_COLLECTION_NAME).insertOne(newRoomToAdd)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const roomModel = {
  ROOM_COLLECTION_NAME,
  ROOM_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails
}