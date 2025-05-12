import { StatusCodes } from 'http-status-codes'
import { conversationService } from '~/services/conversationService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { participants } = req.body
    if (participants.includes(userId)) {
      return res.status(StatusCodes.CONFLICT).json({
        message: 'Bạn đã là chủ của liên hệ này'
      })
    }
    participants.push(userId)
    const createconversation = await conversationService.createNew(participants)
    res.status(StatusCodes.CREATED).json(createconversation)

  } catch (error) {
    next(error)

  }
}
const getDetails = async (req, res, next) => {
  try {
    const currentUserId = req.jwtDecoded._id
    const conversationId = req.params.id
    if (conversationId === undefined) res.status(StatusCodes.OK).json(' từ từ')
    const conversation = await conversationService.getDetails(conversationId, currentUserId)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(conversation)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'trungquandev test error')
  } catch (error) {
    next(error)
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    //     errors: new Error(error).message
    // })
  }
}
const uploadImages = async (req, res, next) => {
  const userAvatarFile = req.file
  const uploadResult = await conversationService.uploadImages(userAvatarFile)
  res.status(StatusCodes.OK).json(uploadResult)
}
const getConversations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const results = await conversationService.getConversations(userId)
    res.status(StatusCodes.OK).json(results)
  } catch (error) {
    next(error)
  }
}

const deleteConversation = async (req, res, next) => {
  try {
    const conversationId = req.params.id
    // Chỉ lấy board thuộc về user nào đó thôi
    await conversationService.deleteConversation(conversationId)

    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json({
      message: 'Hộp thoại đã xóa thành công'
    })
  } catch (error) {
    next(error)
  }
}
export const conversationController = {
  createNew,
  getDetails,
  uploadImages,
  getConversations,
  deleteConversation
}