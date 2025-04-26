import { StatusCodes } from 'http-status-codes'
import { messageService } from '~/services/messageService'

const createNew = async (req, res, next) => {
  try {
    const senderId = req.jwtDecoded._id
    const createMessage = await messageService.createNew(senderId, req.body)
    res.status(StatusCodes.CREATED).json(createMessage)

  } catch (error) {
    next(error)

  }
}
const getDetails = async (req, res, next) => {
  try {
    const currentUserId = req.jwtDecoded._id
    const messageId = req.params.id
    if (!messageId) return
    const message = await messageService.getDetails(messageId, currentUserId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(message)
  } catch (error) {
    next(error)
  }
}

const deleteMessage = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const ids = req.query.ids // Lấy dữ liệu từ query string
    // Chỉ lấy board thuộc về user nào đó thôi
    const result = await messageService.deletemessage(userId, ids)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'messages deleted successfully',
      deletedCount: result.deletedCount
    })
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const getMessages = async (req, res, next) => {
  try {
    // page và itemsPerPage được truyền trong query url từ phía FE nên BE sẽ lấy thông tin qua req. query
    const { conversationId, limit, offset } = req.query
    const results = await messageService.getMessages(conversationId, limit, offset)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
export const messageController = {
  createNew,
  getDetails,
  deleteMessage,
  getMessages
}