import Joi from 'joi'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'
import { HOSTEL_INVITATION_STATUS } from '~/utils/constants'
import { userModel } from './userModel'
import { hostelModel } from './hostelModel'
// Define Collection (name & schema)
const INVITATION_COLLECTION_NAME = 'invitations'
const INVITATION_COLLECTION_SCHEMA = Joi.object({
  inviterId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  inviteeId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  //Kiểu của lời mời
  type: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  hostelInvitation: Joi.object({
    hostelId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    status: Joi.string().required().valid(...Object.values(HOSTEL_INVITATION_STATUS))
  }).optional(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})
const validateBeforeCreate = async (data) => {
  return await INVITATION_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}
const INVALID_UPDATE_FIELDS = ['_id', 'hostelId', 'createAt']
const createNewHostelInvitation = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    let newInvitationtoAdd = {
      ...valiData,
      inviterId: new ObjectId(valiData.inviterId),
      inviteeId: new ObjectId(valiData.inviteeId)
    }
    // Nếu tồn tại dữ liệu hostelInvitation thì update cho hostelId
    if (valiData.hostelInvitation) {
      newInvitationtoAdd.hostelInvitation = {
        ...valiData.hostelInvitation,
        hostelId: new ObjectId(valiData.hostelInvitation.hostelId)
      }
    }
    const createNewHostelInvitation = await GET_DB().collection(INVITATION_COLLECTION_NAME).insertOne(newInvitationtoAdd)
    return createNewHostelInvitation
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const update = async (invitationId, updateData) => {
  try {
    // Lọc những field mà chúng ta không cho phép cập nhật linh tinh
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName] // Xóa các trư��ng không cho phép update
      }
    })
    // Đối với những dữ liệu liên quan đến ObjectId, biến đổi ở đây
    if (updateData.hostelInvitation) {
      updateData.hostelInvitation = {
        ...updateData.hostelInvitation,
        hostelId: new ObjectId(updateData.hostelInvitation.hostelId)
      }
    }
    const result = await GET_DB().collection(INVITATION_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(invitationId) },
      { $set: updateData },
      { returnDocument: 'after' }// Trả về kết quả sau khi đã cập nhật
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}
// Lấy những lời mời thuộc về 1 thằng user cụ thể
const findByUser = async (userId) => {
  try {
    const queryConditions = [
      { inviteeId: new ObjectId(userId) }, // Tìm theo inviteeId - người được mời - chính là người đang thực hiên request này
      { _destroy: false }
    ]
    const results = await GET_DB().collection(INVITATION_COLLECTION_NAME).aggregate([
      {
        $match: { $and: queryConditions }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviterId',
          foreignField: '_id',
          as: 'inviter',
          // pipeline trong lookup để xử lý 1 hoặc nhiều luồng cần thiết
          // $project để chỉ định ra những field mà chúng ta cần lấy về hoawck ko muốn lấy về gán =0
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: userModel.USER_COLLECTION_NAME,
          localField: 'inviteeId',
          foreignField: '_id',
          as: 'invitee',
          pipeline: [{ $project: { password: 0, verifyToken: 0 } }]
        }
      },
      {
        $lookup: {
          from: hostelModel.HOSTEL_COLLECTION_NAME,
          localField: 'hostelInvitation.hostelId', // Thông tin của hostel
          foreignField: '_id',
          as: 'hostel'
        }
      }
    ]).toArray()
    return results
  } catch (error) {
    throw new Error(error)
  }
}
export const invitationModel = {
  INVITATION_COLLECTION_NAME,
  INVITATION_COLLECTION_SCHEMA,
  createNewHostelInvitation,
  findOneById,
  update,
  findByUser
}
