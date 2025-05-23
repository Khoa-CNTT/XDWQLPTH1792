/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * 'A bit of fragrance clings to the hand that gives flowers!'
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { FACILITY_CONDITION } from '~/utils/constants'
import { billModel } from './billsModel'
import { utilityModel } from './utilityModel'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const FACILITY_STATUS_COLLECTION_NAME = 'facilities'
const FACILITY_COLLECTION_SCHEMA = Joi.object({
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  facilityName: Joi.string().required().min(3).max(50).trim().strict(),
  number: Joi.number().required(),
  condition: Joi.string().valid(...Object.values(FACILITY_CONDITION)).default(FACILITY_CONDITION.GOOD),
  createdAt: Joi.date().timestamp('javascript').default(Date.now())
})
const validateBeforeCreate = async (data) => {
  return await FACILITY_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newFacilityToAdd = {
      ...valiData,
      roomId: new ObjectId(valiData.roomId)
    }
    const createdFacility = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).insertOne(newFacilityToAdd)
    return createdFacility
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findByRoomId = async (roomId) => {
  try {
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).find({
      roomId: new ObjectId(roomId)
    }).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByData = async (data) => {
  try {
    if (data.roomId) {
      data.roomId = new ObjectId(data.roomId)
    }
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).findOne(data)
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getAllFacilityByHostelId = async (hostelId) => {
  try {
    const objectId = new ObjectId(hostelId)
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'roomId',
          foreignField: '_id',
          as: 'room'
        }
      },
      { $unwind: '$room' },

      // 2. Filter theo hostelId
      {
        $match: {
          'room.hostelId': objectId
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteFacility = async (id) => {
  try {
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (facilityId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.roomId) {
      updateData.roomId = new ObjectId(updateData.roomId)
    }
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(facilityId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteFacilityByRoomIds = async (roomIds) => {
  try {
    const objectIds = roomIds.map(id => new ObjectId(id))
    const result = await GET_DB().collection(FACILITY_STATUS_COLLECTION_NAME).deleteMany({
      roomId: { $in: objectIds }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const facilityModel = {
  FACILITY_STATUS_COLLECTION_NAME,
  FACILITY_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findByRoomId,
  findOneByData,
  getAllFacilityByHostelId,
  deleteFacility,
  update,
  deleteFacilityByRoomIds
}