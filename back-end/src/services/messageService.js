import { StatusCodes } from 'http-status-codes'
import { messageModel } from '~/models/messageModel'
import { conversationModel } from '~/models/conversationModel'
import { DEFAULT_MESSAGES, DEFAULT_ITEMS_PER_MESSAGES } from '~/utils/constants'
import ApiError from '~/utils/ApiError'

const createNew = async (senderId, reqBody) => {
  try {
    // Kiểm tra xem mảng conversation đã tồn tại trong database hay chưa
    const { conversationId } = reqBody
    const existingConversation = await conversationModel.findOneById(conversationId)
    if (!existingConversation) {
      throw new ApiError(StatusCodes.CONFLICT, 'Cuộc thoại không tồn tại ')
    }
    const createdMessage = await messageModel.createNew(senderId, reqBody)
    //lấy bản ghi message sau khi gọi(Tùy vào dự án mà bước này có cần gọi  hay không)
    const getNewMessage = await messageModel.findOneById(createdMessage.insertedId)
    const lastMessage = {
      senderId: senderId,
      content: reqBody.content
    }
    const result = await conversationModel.update(conversationId, { lastMessage })

    return result
  } catch (error) {
    throw error
  }
}
const getDetails = async (messageId, currentUserId) => {
  try {
    const message = await messageModel.getDetails(messageId, currentUserId)
    if (!message) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'message not found')
    }
    return message
  } catch (error) {
    throw error
  }
}
const getMessages = async (conversationId, limit, offset) => {
  try {
    // Nếu không có limit và offset từ phía FE, gán giá trị mặc định
    if (!limit) limit = DEFAULT_ITEMS_PER_MESSAGES
    if (!offset) offset = DEFAULT_MESSAGES

    // Chuyển đổi limit, offset thành số
    limit = parseInt(limit, 10)
    offset = parseInt(offset, 10)

    const result = await messageModel.getMessages(conversationId, limit, offset)

    return result
  } catch (error) {
    throw error
  }
}

export const messageService = {
  createNew,
  getDetails,
  getMessages
}