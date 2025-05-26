import Joi from 'joi'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE, DATE_RULE, DATE_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'
import { CONSTRACT_STATUS } from '~/utils/constants'
import { roomModel } from './roomModel'
import { hostelModel } from './hostelModel'


// Define Collection (name & schema)
const CONTRACT_COLLECTION_NAME = 'contracts'
const CONTRACT_COLLECTION_SCHEMA = Joi.object({
  contractName: Joi.string().min(3).max(50).trim().strict(),
  content: Joi.string().trim().strict(),
  dateStart: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE).required(),
  dateEnd: Joi.string().pattern(DATE_RULE).message(DATE_RULE_MESSAGE).required(),
  deposit: Joi.number().required(),
  status: Joi.string().valid(...Object.values(CONSTRACT_STATUS)).default(CONSTRACT_STATUS.ACTIVE),
  ownerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  tenantId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  roomId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const validateBeforeCreate = async (data) => {
  return await CONTRACT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'createAt', 'hostelId', 'roomId', 'tenantId']
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const req = {
      ...valiData,
      ownerId: new ObjectId(valiData.ownerId),
      tenantId: new ObjectId(valiData.tenantId),
      roomId: new ObjectId(valiData.roomId),
      hostelId: new ObjectId(valiData.hostelId)
    }
    const createdcontract = await GET_DB().collection(CONTRACT_COLLECTION_NAME).insertOne(req)
    return createdcontract
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CONTRACT_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findContract = async (userId, tenantId) => {
  try {
    const result = await GET_DB().collection(CONTRACT_COLLECTION_NAME).findOne({
      $and: [
        { ownerId: new ObjectId(userId) },
        { tenantId: new ObjectId(tenantId) },
        { status: CONSTRACT_STATUS.ACTIVE }
      ]
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id, currentUserId) => {
  try {
    const result = await GET_DB().collection(CONTRACT_COLLECTION_NAME).aggregate([
      {
        $match: { _id: new ObjectId(id) }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME, // Tên collection của user
          localField: 'participants', // Trường trong hostel để nối
          foreignField: '_id', // Trường trong user để nối
          as: 'inforUsers', // Tên trường chứa thông tin user sau khi lookup
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $addFields: {
          currentUser: new ObjectId(currentUserId)
        }
      }
    ]).toArray()
    return result[0]
  } catch (error) {
    throw new Error(error)
  }
}
const getContracts = async (userId) => {
  try {
    const result = await GET_DB().collection(CONTRACT_COLLECTION_NAME).aggregate(
      [
        {
          $match: {
            $or: [
              { ownerId: new ObjectId(userId) },
              { tenantId: new ObjectId(userId) }
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
          $lookup: {
            from: userModel.USER_COLLECTION_NAME, // Tên collection của user
            localField: 'tenantId', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'tenantInfo', // Tên trường chứa thông tin user sau khi lookup
            pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
          }
        },
        {
          $lookup: {
            from: roomModel.ROOM_COLLECTION_NAME, // Tên collection của user
            localField: 'roomId', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'roomInfo' // Tên trường chứa thông tin user sau khi lookup
          }
        },
        {
          $lookup: {
            from: hostelModel.HOSTEL_COLLECTION_NAME, // Tên collection của user
            localField: 'hostelId', // Trường trong hostel để nối
            foreignField: '_id', // Trường trong user để nối
            as: 'hostelInfo' // Tên trường chứa thông tin user sau khi lookup
          }
        }
      ]
    ).toArray()
    return result || null
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (contractId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })

    const result = await GET_DB().collection(CONTRACT_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(contractId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const contractModel = {
  CONTRACT_COLLECTION_NAME,
  CONTRACT_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findContract,
  getContracts,
  getDetails,
  update
}
