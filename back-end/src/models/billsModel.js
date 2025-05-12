/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { utilityModel } from './utilityModel'
import { roomModel } from './roomModel'
import { BILL_STATUS } from '~/utils/constants'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const BILL_STATUS_COLLECTION_NAME = 'bills'
const BILL_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  utilityId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  expenseTitle: Joi.number().required(),
  extraFees: Joi.number().required(),
  totalAmount: Joi.number().required(),
  status: Joi.string().valid(...Object.values(BILL_STATUS)).default(BILL_STATUS.PENDING),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const validateBeforeCreate = async (data) => {
  return await BILL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newBillToAdd = {
      ...valiData,
      utilityId: new ObjectId(valiData.utilityId),
      roomId: new ObjectId(valiData.roomId)
    }
    const createdBill = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).insertOne(newBillToAdd)
    return createdBill
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (data) => {
  try {
    if (data.utilityId) {
      data.utilityId = new ObjectId(data.utilityId)
    }
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).aggregate([
      {
        $match: data
      },
      {
        $lookup: {
          from: utilityModel.UTILITY_COLLECTION_NAME,
          localField: 'utilityId',
          foreignField: '_id',
          as: 'utilityInfo'
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
const deleteBills = async (ids) => {
  try {
    const objectIds = ids.map(id => new ObjectId(id))
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).deleteMany({
      _id: { $in: objectIds }
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
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(utilityId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getBills = async (data) => {
  try {
    if (data.hostelId) {
      data.hostelId = new ObjectId(data.hostelId)
    }
    if (data.roomId) {
      data.roomId = new ObjectId(data.roomId)
    }
    const queryConditions = Object.entries(data).map(([key, value]) => ({ [key]: value }))
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).aggregate(
      [
        {
          $match: { $and: queryConditions }
        },
        {
          $lookup: {
            from: utilityModel.UTILITY_COLLECTION_NAME,
            localField: 'utilityId',
            foreignField: '_id',
            as: 'utilityInfo'
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
export const billModel = {
  BILL_STATUS_COLLECTION_NAME,
  BILL_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  deleteBills,
  update,
  getBills
}