
/**
 * Updated by trungquandev.com's author on Oct 8 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, PHONE_NUMBER_RULE, CITIZEN_NUMBER } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'


// Define tạm 2 roles cho user, tùy việc mở rộng dự án như thế nào mà mọi người có thể thêm role tùy ý cho phù hợp
const USER_ROLES = {
  CLIENT: 'client',
  ADMIM: 'admin'
}
// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),

  // Username cắt ra từ email sẽ có khả năng không unique bởi vì có những tên email trùng nhau nhưng từ nhà cung cấp khác nhau
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIM).default(USER_ROLES.CLIENT),

  age: Joi.number().integer().min(0).max(120).default(0),
  phone: Joi.string().pattern(PHONE_NUMBER_RULE).default(null),
  address: Joi.string().trim().default(null), // Không bắt buộc nhập
  citizenId: Joi.string().pattern(CITIZEN_NUMBER).default(null),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(), // Tạo verifyToken từ tư viện import uuid


  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),  
  _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createAt']
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(valiData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne(
      { email: emailValue }
    )
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
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  USER_ROLES,
  createNew,
  findOneById,
  update,
  findOneByEmail
}
