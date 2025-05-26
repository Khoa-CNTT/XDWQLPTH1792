import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { REQUETS_STATUS } from '~/utils/constants'
import { userModel } from './userModel'
import { hostelModel } from './hostelModel'
import { roomModel } from './roomModel'
// Define Collection (name & schema)
const REQUEST_COLLECTION_NAME = 'requests'
const REQUEST_COLLECTION_SCHEMA = Joi.object({
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  tenantId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  type: Joi.string().required().min(3).max(50).trim().strict(),
  status: Joi.string().required().valid(...Object.values(REQUETS_STATUS)),
  description: Joi.string().required().trim().strict(),
  image: Joi.string().required().messages({
    'any.required': 'Image is required',
    'string.empty': 'Image must not be an empty string'
  }),
  createdAt: Joi.date().timestamp('javascript').default(Date.now)
})
const validateBeforeCreate = async (data) => {
  return await REQUEST_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'hostelId', 'createAt']
const createNewRepairRequest = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    let newRequest = {
      ...valiData,
      hostelId: new ObjectId(valiData.hostelId),
      roomId: new ObjectId(valiData.roomId),
      tenantId: new ObjectId(valiData.tenantId),
    }
    const createNewHostelInvitation = await GET_DB().collection(REQUEST_COLLECTION_NAME).insertOne(newRequest)
    return createNewHostelInvitation
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(REQUEST_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (requestId, status) => {
  try {
    const result = await GET_DB().collection(REQUEST_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(requestId) },
      { $set: { status } },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// Lấy những lời mời thuộc về 1 thằng user cụ thể
const getRequests = async (data) => {
  try {
    if (data.hostelId) {
      data.hostelId = new ObjectId(data.hostelId)
    }
    if (data.roomId) {
      data.roomId = new ObjectId(data.roomId)
    }
    if (data.tenantId) {
      data.tenantId = new ObjectId(data.tenantId)
    }
    const queryConditions = Object.entries(data).map(([key, value]) => ({ [key]: value }))
    const results = await GET_DB().collection(REQUEST_COLLECTION_NAME).aggregate([
      {
        $match: { $and: queryConditions }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'tenantId',
          foreignField: '_id',
          as: 'tenant',
          // pipeline trong lookup để xử lý 1 hoặc nhiều luồng cần thiết
          // $project để chỉ định ra những field mà chúng ta cần lấy về hoawck ko muốn lấy về gán =0
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: hostelModel.HOSTEL_COLLECTION_NAME,
          localField: 'hostelId', // Thông tin của hostel
          foreignField: '_id',
          as: 'hostel'
        }
      },
      {
        $lookup: {
          from: roomModel.ROOM_COLLECTION_NAME,
          localField: 'roomId', // Thông tin của hostel
          foreignField: '_id',
          as: 'room'
        }
      }
    ]).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}
const getRequestsByOwnerId = async (ownerId) => {
  try {
    const results = await GET_DB().collection(REQUEST_COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: hostelModel.HOSTEL_COLLECTION_NAME,
          localField: 'hostelId',
          foreignField: '_id',
          as: 'hostel'
        }
      },
      {
        $unwind: '$hostel' // Vì mỗi request chỉ gắn với 1 hostel
      },
      {
        $match: {
          'hostel.ownerId': new ObjectId(ownerId)
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'tenantId',
          foreignField: '_id',
          as: 'tenant',
          pipeline: [
            { $project: { password: 0, verifyToken: 0 } }
          ]
        }
      },
      {
        $lookup: {
          from: roomModel.ROOM_COLLECTION_NAME,
          localField: 'roomId',
          foreignField: '_id',
          as: 'room'
        }
      }
    ]).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}
export const requestModel = {
  REQUEST_COLLECTION_NAME,
  REQUEST_COLLECTION_SCHEMA,
  createNewRepairRequest,
  findOneById,
  update,
  getRequests,
  getRequestsByOwnerId
}
