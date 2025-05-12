import { StatusCodes } from 'http-status-codes'
import { conversationModel } from '~/models/conversationModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/Cloudinary'
import { messageModel } from '~/models/messageModel'

const createNew = async (participants) => {
  try {
    // Kiểm tra xem mảng participants đã tồn tại trong database hay chưa
    const existingConversation = await conversationModel.findOneByParticipants(participants)
    if (existingConversation) {
      return existingConversation
    }
    const createdConversation = await conversationModel.createNew({ participants })
    //lấy bản ghi conversation sau khi gọi(Tùy vào dự án mà bước này có cần gọi  hay không)
    const getNewConversation = await conversationModel.findOneById(createdConversation.insertedId)
    return getNewConversation
  } catch (error) {
    throw error
  }
}
const getDetails = async (conversationId, currentUserId) => {
  try {
    const conversation = await conversationModel.getDetails(conversationId, currentUserId)
    if (!conversation) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Conversation not found')
    }
    return conversation
  } catch (error) {
    throw error
  }
}

const uploadImages = async (userAvatarFile) => {
  try {
    // Trường hợp upload file lên Cloud Storage, cụ thể là Cloudinary
    const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'conversations')
    return uploadResult.secure_url
  } catch (error) {
    throw error
  }
}
const getConversations = async (userId) => {
  try {
    const conversation = await conversationModel.getConversations(userId)
    return conversation
  } catch (error) {
    throw error
  }
}
const deleteConversation = async (conversationId) => {
  try {
    // Xóa tất cả tin nhắn trong hộp thoại
    await messageModel.deleteAllMessagesOfConversation(conversationId)
    // Xóa hộp thoại
    const result = await conversationModel.deleteConversation(conversationId)
    console.log('result', result)
  } catch (error) {
    throw error
  }
}

export const conversationService = {
  createNew,
  getDetails,
  uploadImages,
  getConversations,
  deleteConversation
}