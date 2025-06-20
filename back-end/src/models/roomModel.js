/**
 * Updated by 0dev.com's author on August 17 2023
 * YouTube: https://youtube.com/@0dev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId, ReturnDocument } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE, PHONE_NUMBER_RULE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { STATUS_ROOM } from '~/utils/constants'
import { userModel } from './userModel'
import { hostelModel } from './hostelModel'

const INVALID_UPDATE_FIELDS = ['_id']
const ROOM_COLLECTION_NAME = 'rooms'
const ROOM_COLLECTION_SCHEMA = Joi.object({
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomName: Joi.string().required().max(50).trim(),
  length: Joi.number().required(),
  width: Joi.number().required(),
  utilities: Joi.array().items(Joi.string().max(50).trim().strict()).default([]),
  memberIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  billIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  images: Joi.string().required().messages({
    'any.required': 'Image is required',
    'string.empty': 'Image must not be an empty string'
  }),
  status: Joi.string().valid(STATUS_ROOM.AVAILABLE, STATUS_ROOM.OCCUPIED, STATUS_ROOM.MAINTENANCE).default(STATUS_ROOM.AVAILABLE),
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
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).aggregate([
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
          from: userModel.USER_COLLECTION_NAME, // Tên collection của user
          localField: 'memberIds', // Trường trong hostel để nối
          foreignField: '_id', // Trường trong user để nối
          as: 'tenantsInfo', // Tên trường chứa thông tin owner sau khi lookup
          pipeline: [{ $project: { password: 0, verifyToken: 0, isActive: 0 } }]
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
const deleteRooms = async (ids) => {
  try {
    const objectIds = ids.map(id => new ObjectId(id))
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).deleteMany({
      _id: { $in: objectIds }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (roomId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.memberIds) {
      updateData.memberIds = updateData.memberIds.map(_id => (new ObjectId(_id)))
    }
    if (updateData.billIds) {
      updateData.billIds = updateData.billIds.map(_id => (new ObjectId(_id)))
    }
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const pushMembers = async (roomId, userId) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      { $push: { memberIds: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const pushBillIds = async (roomId, billId) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      { $push: { billIds: new ObjectId(billId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const pushUtility = async (roomId, facilityName) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(roomId) },
      { $push: { utilities: facilityName } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getRoomsByHostelId = async (hostelId) => {
  try {
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).aggregate(
      [
        {
          $match: { hostelId: new ObjectId(hostelId) }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME, // Tên collection của user
            localField: 'memberIds', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'tenantsInfo', // Tên trường chứa thông tin user sau khi lookup
            pipeline: [{ $project: { password: 0, verifyToken: 0, isActive: 0 } }]
          }
        }
      ]
    ).toArray()
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}
const deleteBillIds = async (roomId, billId) => {
  try {
    // Chuyển đổi mảng `_id` thành ObjectId
    const objectId = new ObjectId(billId)
    // Xóa  có `_id` nằm trong mảng
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(roomId) },
      { $pull: { billIds: objectId } },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const pullFacilityInRoom = async (roomId, facilityName) => {
  try {
    // Xóa  có `_id` nằm trong mảng
    const result = await GET_DB().collection(ROOM_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(roomId) },
      { $pull: { utilities: facilityName } },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
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
  getDetails,
  deleteRooms,
  update,
  pushMembers,
  getRoomsByHostelId,
  pushBillIds,
  deleteBillIds,
  pushUtility,
  pullFacilityInRoom
}