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
import { roomModel } from './roomModel'
import { userModel } from './userModel'
import { HOSTEL_TYPES } from '~/utils/constants'

// Chỉ định ra những FIELDS mà chúng ta không muốn cho phép update trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']
const HOSTEL_COLLECTION_NAME = 'Hostel'
const HOSTEL_COLLECTION_SCHEMA = Joi.object({
  hostelName: Joi.string().required().min(3).max(50).trim().strict(),
  address: Joi.string().required().min(3).max(50).trim().strict(),
  roomIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  ownerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  images: Joi.string().required().messages({
    'any.required': 'Image is required',
    'string.empty': 'Image must not be an empty string'
  }),
  tenantIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  type: Joi.string().valid(HOSTEL_TYPES.PUBLIC, HOSTEL_TYPES.PRIVATE).default(HOSTEL_TYPES.PUBLIC)
})
const validateBeforeCreate = async (data) => {
  return await HOSTEL_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (userId, data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newHostel = {
      ...valiData,
      ownerId: new ObjectId(userId)
    }
    console.log('valiData', valiData)
    const createdBoard = await GET_DB().collection(HOSTEL_COLLECTION_NAME).insertOne(newHostel)
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
    // const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOne({
    //   _id: new ObjectId(id)
    // })
    // return result
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).aggregate([
      {
        $match: { _id: new ObjectId(id) }
      },
      {
        $lookup: {
          from: roomModel.ROOM_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'hostelId',
          as: 'rooms'
        }
      }
    ]).toArray()
    return result[0] || null
  } catch (error) {
    throw new Error(error)
  }
}
// Đẩy 1 phần tủ vào cuối mảng
// Nhiệm vụ của function này là push 1 cái giá trị roomId vào cuối mảng roomOrderIds
const pushRoomOrderIds = async (room) => {
  try {
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(room.hostelId), },
      { $push: { roomOrderIds: new ObjectId(room._id) } },
      { ReturnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getHostels = async (userId) => {
  try {
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).aggregate(
      [
        { $match: { ownerId: { $all: [new ObjectId(userId)] } } },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME, // Tên collection của user
            localField: 'ownerId', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'ownerInfo' // Tên trường chứa thông tin user sau khi lookup
          }
        },
        {
          $addFields: {
            ownerPhone: { $arrayElemAt: ['$ownerInfo.phone', 0] } // Lấy số điện thoại từ mảng ownerInfo
          }
        },
        {
          $project: {
            ownerInfo: 0 // Loại bỏ trường ownerInfo nếu không cần
          }
        }
      ]
    ).toArray()
    console.log('result', result)
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (hostelId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.roomIds) {
      updateData.roomIds = updateData.roomIds.map(_id => (new ObjectId(_id)))
    }
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(hostelId), },
      { $set: updateData },
      { ReturnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const hostelModel = {
  createNew,
  findOneById,
  getDetails,
  pushRoomOrderIds,
  getHostels,
  update
}