import Joi from 'joi'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { userModel } from './userModel'
import { create } from 'lodash'


// Define Collection (name & schema)
const CONVERSATION_COLLECTION_NAME = 'conversations'
const CONVERSATION_COLLECTION_SCHEMA = Joi.object({
  participants: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
  ).required(),
  isGroup: Joi.boolean().default(false),
  createAt: Joi.date().timestamp('javascript').default(Date.now()),
  lastMessage: Joi.object({
    sender: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    content: Joi.string(),
    createAt: Joi.date().timestamp('javascript').default(Date.now())
  }).default(null).optional()
})
const validateBeforeCreate = async (data) => {
  return await CONVERSATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'createAt']
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const req = {
      ...valiData,
      participants: valiData?.participants?.map(id => new ObjectId(id))
    }
    const createdConversation = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).insertOne(req)
    return createdConversation
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getDetails = async (id, currentUserId) => {
  try {
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).aggregate([
      {
        $match:  { _id: new ObjectId(id) }
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
const findOneByParticipants = async (participants) => {
  try {
    // Chuyển đổi các ID trong participants thành ObjectId
    const objectIdParticipants = participants?.map(id => new ObjectId(id))

    // Tìm kiếm conversation với các điều kiện:
    // 1. Tất cả các phần tử trong participants phải tồn tại trong mảng participants của database ($all)
    // 2. Độ dài của mảng participants trong database phải bằng với mảng được truyền vào ($expr và $size)
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOne({
      participants: { $all: objectIdParticipants }, //
      $expr: { $eq: [{ $size: '$participants' }, objectIdParticipants.length] }
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (conversationId, updateData) => {
  try {
    if (typeof updateData?.lastMessage?.senderId === 'string')
      updateData.lastMessage.senderId = new ObjectId(updateData.lastMessage.senderId)

    const lastMessage = {
      ...updateData.lastMessage,
      createAt: Date.now()
    }
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(conversationId) },
      { $set: { lastMessage } },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getConversations = async (userId) => {
  try {
    // Chuyển đổi userId thành ObjectId
    const objectIdUserId = new ObjectId(userId)
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).aggregate([
      {
        $match: { participants: { $in: [objectIdUserId] } }
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
          currentUser: new ObjectId(userId) // Lấy số điện thoại từ mảng ownerInfo
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const deleteConversation = async (conversationId) => {
  try {
    const result = await GET_DB().collection(CONVERSATION_COLLECTION_NAME).deleteOne({
      _id: new ObjectId(conversationId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const conversationModel = {
  CONVERSATION_COLLECTION_NAME,
  CONVERSATION_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  findOneByParticipants,
  getConversations,
  getDetails,
  deleteConversation
}
