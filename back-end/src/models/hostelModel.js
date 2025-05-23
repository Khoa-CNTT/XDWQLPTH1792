/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { roomModel } from './roomModel'
import { userModel } from './userModel'
import { HOSTEL_TYPES } from '~/utils/constants'

// Chỉ định ra những FIELDS mà chúng ta không muốn cho phép update trong hàm update()
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']
const HOSTEL_COLLECTION_NAME = 'Hostel'
const HOSTEL_COLLECTION_SCHEMA = Joi.object({
  hostelName: Joi.string().required().min(3).max(50).trim().strict(),
  address: Joi.string().required().min(3).max(256).trim().strict(),
  roomIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  ownerId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  images: Joi.string().required().messages({
    'any.required': 'Image is required',
    'string.empty': 'Image must not be an empty string'
  }),
  electricity_price: Joi.number().required(),
  water_price: Joi.number().required(),
  description: Joi.string().required(),
  tenantIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)).default([]),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  type: Joi.string().required().valid(HOSTEL_TYPES.PUBLIC, HOSTEL_TYPES.PRIVATE).default(HOSTEL_TYPES.PUBLIC)
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
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME, // Tên collection của user
          localField: 'ownerId', // Trường trong hostel để nối
          foreignField: '_id', // Trường trong user để nối
          as: 'ownerInfo', // Tên trường chứa thông tin owner sau khi lookup
          pipeline: [{ $project: { password: 0, verifyToken: 0, isActive: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'tenantIds',
          foreignField: '_id',
          as: 'tenants',
          // pipeline trong lookup để xử lý 1 hoặc nhiều luồng cần thiết
          // $project để chỉ định ra những field mà chúng ta cần lấy về hoawck ko muốn lấy về gán =0
          pipeline: [{ $project: { password: 0, verifyToken: 0, isActive: 0 } }]
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
      { $push: { roomIds: new ObjectId(room._id) } },
      { returnDocument: 'after' }
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
        {
          $match: {
            $or: [
              { ownerId: new ObjectId(userId) },
              { tenantIds: { $all: [new ObjectId(userId)] } }
            ]
          }
        },
        {
          $lookup: {
            from: userModel.USER_COLLECTION_NAME, // Tên collection của user
            localField: 'ownerId', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'ownerInfo', // Tên trường chứa thông tin user sau khi lookup
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $addFields: {
            ownerPhone: { $arrayElemAt: ['$ownerInfo.phone', 0] }, // Lấy số điện thoại từ mảng ownerInfo
            ownerName: { $arrayElemAt: ['$ownerInfo.displayName', 0] } // Lấy số điện thoại từ mảng ownerInfo
          }
        },
        {
          $lookup: {
            from: roomModel.ROOM_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'hostelId',
            as: 'rooms'
          }
        }
        // {
        //   $project: {
        //     ownerInfo: 0 // Loại bỏ trường ownerInfo nếu không cần
        //   }
        // }
      ]
    ).toArray()
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
      { _id: new ObjectId(hostelId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteHostel = async (userId, ids) => {
  try {
    // Chuyển đổi mảng `_id` thành ObjectId
    const objectIds = ids.map(id => new ObjectId(id))
    // Xóa các tài liệu có `_id` nằm trong mảng
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).deleteMany({
      _id: { $in: objectIds },
      ownerId: new ObjectId(userId) // Chỉ xóa những hostel thuộc về user này thôi
    })

    return result
  } catch (error) {
    throw new Error(error)
  }
}
const deleteRoomOrderIds = async (ids) => {
  try {
    // Chuyển đổi mảng `_id` thành ObjectId
    const objectIds = ids.map(id => new ObjectId(id))
    const room = await roomModel.findOneById(ids[0])
    const { hostelId } = room
    // Xóa  có `_id` nằm trong mảng
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).updateOne(
      { _id: new ObjectId(hostelId) },
      { $pull: { roomIds: { $in: objectIds } } },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const pushTenantIds = async (hostelId, userId) => {
  try {
    const result = await GET_DB().collection(HOSTEL_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(hostelId) },
      { $push: { tenantIds: new ObjectId(userId) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getHostelsPublic = async (find) => {
  try {
    // Bước 1: tạo query cơ bản
    const baseMatch = {}
    if (find?.type) baseMatch.type = find.type
    if (find?.address) {
      baseMatch.address = { $regex: find.address, $options: 'i' }
    }
    const pipeline = [
      { $match: baseMatch },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'ownerId',
          foreignField: '_id',
          as: 'ownerInfo'
        }
      },
      {
        $lookup: {
          from: roomModel.ROOM_COLLECTION_NAME,
          localField: '_id',
          foreignField: 'hostelId',
          as: 'rooms'
        }
      },
      {
        $addFields: {
          minPrice: { $min: '$rooms.price' },
          maxPrice: { $max: '$rooms.price' }
        }
      }
    ]

    if (find?.price) {
      const price = parseFloat(find.price)
      pipeline.push({
        $match: {
          $expr: {
            $and: [
              { $lte: ['$minPrice', price] },
              { $gte: ['$maxPrice', price] }
            ]
          }
        }
      })
    }

    const result = await GET_DB()
      .collection(HOSTEL_COLLECTION_NAME)
      .aggregate(pipeline)
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const hostelModel = {
  HOSTEL_COLLECTION_NAME,
  HOSTEL_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushRoomOrderIds,
  getHostels,
  update,
  deleteHostel,
  deleteRoomOrderIds,
  pushTenantIds,
  getHostelsPublic
}