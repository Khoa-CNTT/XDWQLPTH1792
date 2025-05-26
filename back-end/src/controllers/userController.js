/**
 * Updated by 0dev.com's author on August 17 2023
 * YouTube: https://youtube.com/@0dev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import { StatusCodes } from 'http-status-codes'
// import ApiError from '~/utils/ApiError'
import { userService } from '~/services/userService'
import ms from 'ms'
import ApiError from '~/utils/ApiError'
const createNew = async (req, res, next) => {
  try {
    const createdUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}
const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const generatePassword = async (req, res, next) => {
  try {
    await userService.generatePassword(req.body)
    res.status(StatusCodes.OK).json({
      message: 'Đổi mật khẩu thành công. Vui lòng kiểm tra email để nhận mật khẩu mới.'
    })
  } catch (error) {
    next(error)
  }
}
const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    /** Xử lý trả về http only cookie cho phía trình duyệt
     * Về cái maxAge và thư viện
     * Đối với maxAge- thời gian sống của cookie thì chúng ta sẽ tối đa 14 ngày, tùy dự án. Lưu ý thời gian sống của
     cookie khác với thời gian sống của token. Đừng bị nhầm lẫn
     */
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}
const logout = async (req, res, next) => {
  try {
    // Xóa cookie - đơn giản là ngược lại so với việc gán cookie ở hàm login
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) {
    next(error)
  }
}
const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)
    res.cookie('accessToken', result.accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: ms('14 days') })
    res.clearCookie('refreshToken')
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Hãy đăng nhập lại!'))
  }
}
const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    const updatedUser = await userService.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const updateByAdmin = async (req, res, next) => {
  try {
    const userId = req.params.id
    const userAvatarFile = req.file
    const updatedUser = await userService.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const getAllAccounts = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const updatedUser = await userService.getAllAccounts(userId)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const accountIsDeletedId = req.params.id
    const updatedUser = await userService.deleteAccount(userId, accountIsDeletedId)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) {
    next(error)
  }
}

export const userController = {
  createNew,
  verifyAccount,
  login,
  logout,
  refreshToken,
  update,
  getAllAccounts,
  updateByAdmin,
  deleteAccount,
  generatePassword
}