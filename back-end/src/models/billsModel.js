/**
 * Updated by 0dev.com's author on August 17 2023
 * YouTube: https://youtube.com/@0dev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { utilityModel } from './utilityModel'
import { roomModel } from './roomModel'
import { BILL_STATUS } from '~/utils/constants'
import { hostelModel } from './hostelModel'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const BILL_STATUS_COLLECTION_NAME = 'bills'
const BILL_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  utilityId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  expenseTitle: Joi.string().allow('').default(''),
  extraFees: Joi.number().empty('').empty(null).default(0),
  totalAmount: Joi.number().required(),
  status: Joi.string().valid(...Object.values(BILL_STATUS)).default(BILL_STATUS.PENDING),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  isDeleted: Joi.boolean().default(false)
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
      roomId: new ObjectId(valiData.roomId),
      hostelId: new ObjectId(valiData.hostelId)
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
    if (data.roomId) {
      data.roomId = new ObjectId(data.roomId)
    }
    if (data.hostelId) {
      data.hostelId = new ObjectId(data.hostelId)
    }
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).aggregate([
      {
        $match: { ...data }
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
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}
const deleteBill = async (billId) => {
  try {
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(billId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (billId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(billId) },
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
const findBillsByUtilityIds = async (utilityIds) => {
  try {
    const objectIds = utilityIds?.map(id => new ObjectId(id))
    const result = await GET_DB().collection(BILL_STATUS_COLLECTION_NAME).aggregate([
      {
        $match: {
          $and: [
            { utilityId: { $in: objectIds } }
          ]
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw error
  }
}
export const billModel = {
  BILL_STATUS_COLLECTION_NAME,
  BILL_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  deleteBill,
  update,
  getBills,
  findBillsByUtilityIds
}