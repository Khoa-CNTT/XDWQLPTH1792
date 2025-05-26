
/**
 * Updated by 0dev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@0dev
 * 'A bit of fragrance clings to the hand that gives flowers!'
 */

import Joi from 'joi'
import { OBJECT_ID_RULE_MESSAGE, OBJECT_ID_RULE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { messageSkipValue } from '~/utils/algorithms'


// Define Collection (name & schema)
const MESSAGE_COLLECTION_NAME = 'messages'
const MESSAGE_COLLECTION_SCHEMA = Joi.object({
  conversationId:Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE).required(),
  senderId: Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  content:Joi.string().trim().required(),
  createdAt: Joi.date().timestamp('javascript').default((() => Date.now())),
  updatedAt: Joi.date().timestamp('javascript').default(null)
})
const validateBeforeCreate = async (data) => {
  return await MESSAGE_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createAt']
const createNew = async (senderId, reqBody) => {
  try {
    const valiData = await validateBeforeCreate(reqBody)
    const req = {
      ...valiData,
      conversationId: new ObjectId(valiData.conversationId),
      senderId: new ObjectId(senderId)
    }
    const createdConversation = await GET_DB().collection(MESSAGE_COLLECTION_NAME).insertOne(req)
    return createdConversation
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (userId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const getMessages = async (conversationId, limit, offset) => {
  try {
    const queryConditions = [
      { conversationId: new ObjectId(conversationId) }
    ]
    const query = await GET_DB().collection(MESSAGE_COLLECTION_NAME).aggregate([
      { $match: { $and: queryConditions } },
      { $sort: { createdAt: -1 } }, // Mới nhất trước
      {
        $facet: {
          'queryMessages': [
            { $skip: messageSkipValue(offset, limit) },
            { $limit: Number(limit) }
          ],
          'queryTotalMessages': [
            { $count: 'countedAllMessages' }
          ]
        }
      }
    ]).toArray()

    const res = query[0]

    return {
      messages: res.queryMessages || [],
      totalMessages: res.queryTotalMessages[0]?.countedAllMessages || 0
    }
  } catch (error) {
    throw new Error(error)
  }
}

const deleteAllMessagesOfConversation = async (conversationId) => {
  try {
    const result = await GET_DB().collection(MESSAGE_COLLECTION_NAME).deleteMany({
      conversationId: new ObjectId(conversationId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const messageModel = {
  MESSAGE_COLLECTION_NAME,
  MESSAGE_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  getMessages,
  deleteAllMessagesOfConversation
}
