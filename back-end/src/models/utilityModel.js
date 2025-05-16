/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, MONTH_YEAR_RULE, MONTH_YEAR_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { hostelModel } from './hostelModel'
import { roomModel } from './roomModel'

const INVALID_UPDATE_FIELDS = ['_id']
const UTILITY_COLLECTION_NAME = 'utilities'
const UTILITY_COLLECTION_SCHEMA = Joi.object({
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  month: Joi.string().pattern(MONTH_YEAR_RULE).message(MONTH_YEAR_RULE_MESSAGE).required(),
  waterStart: Joi.number().required(),
  waterBegin: Joi.number().required(),
  electricStart: Joi.number().required(),
  electricBegin: Joi.number().required(),
  toltalUtility: Joi.number().required(),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const validateBeforeCreate = async (data) => {
  return await UTILITY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newutilityToAdd = {
      ...valiData,
      hostelId: new ObjectId(valiData.hostelId),
      roomId: new ObjectId(valiData.roomId)
    }
    const createdBoard = await GET_DB().collection(UTILITY_COLLECTION_NAME).insertOne(newutilityToAdd)
    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id) => {
  try {
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).aggregate([
      {
        $match: { _id: new ObjectId(id) }
      },
      {
        $lookup: {
          from: hostelModel.HOSTEL_COLLECTION_NAME,
          localField: 'hostelId',
          foreignField: '_id',
          as: 'hostelInfo'
        }
      },
      {
        $lookup: {
          from: roomModel.ROOM_COLLECTION_NAME,
          localField: 'roomId',
          foreignField: '_id',
          as: 'roomInfo'
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
const deleteUtilities = async (ids) => {
  try {
    const objectIds = ids.map(id => new ObjectId(id))
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).deleteMany({
      _id: { $in: objectIds }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteUtilitiesByRoomIds = async (roomIds) => {
  try {
    const objectIds = roomIds.map(id => new ObjectId(id))
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).deleteMany({
      roomId: { $in: objectIds }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (utilityId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    if (updateData.roomIds) {
      updateData.roomIds = updateData.roomIds.map(_id => (new ObjectId(_id)))
    }
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(utilityId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getUtilities = async (data) => {
  try {
    if (data.hostelId) {
      data.hostelId = new ObjectId(data.hostelId)
    }
    if (data.roomId) {
      data.roomId = new ObjectId(data.roomId)
    }
    const queryConditions = Object.entries(data).map(([key, value]) => ({ [key]: value }))
    const result = await GET_DB().collection(UTILITY_COLLECTION_NAME).aggregate(
      [
        {
          $match: { $and: queryConditions }
        },
        {
          $lookup: {
            from: hostelModel.HOSTEL_COLLECTION_NAME,
            localField: 'hostelId',
            foreignField: '_id',
            as: 'hostelInfo'
          }
        },
        {
          $lookup: {
            from: roomModel.ROOM_COLLECTION_NAME,
            localField: 'roomId',
            foreignField: '_id',
            as: 'roomInfo'
          }
        }
      ]
    ).toArray()
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}
export const utilityModel = {
  UTILITY_COLLECTION_NAME,
  UTILITY_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  deleteUtilities,
  update,
  getUtilities,
  deleteUtilitiesByRoomIds
}