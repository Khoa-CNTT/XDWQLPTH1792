import { userModel } from '~/models/userModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs' // dùng để kiểm tra mật khẩu đã băm
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formmasters'

import { WEBSITE_DOMAIN } from '~/utils/constants'
import { BrevoProvide } from '~/providers/BrevoProvider'
import { env } from '~/config/environment'

import { JwtProvider } from '~/providers/JwtProvider'
const createNew = async (reqBody) => {
  try {
    // Kiểm tra xem email đã tồn tại trong hệ thống của chúng ta hay chưa
    const exisUser = await userModel.findOneByEmail(reqBody.email)

    if (exisUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists ')
    }
    // Tạo data để lưu vào Database
    //nameFromEmail: nếu email là huynguyen@gmail.com thì sẽ lấy đc "huynguyen"
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // tham số thứ 2 là độ phức tạp, giá trị càng cao thì băm càng lâu
      username: nameFromEmail,
      displayName: nameFromEmail, // mặc định để giống username khi user đăng ký mới, về sau làm tính năng update cho user
      verifyToken: uuidv4()

    }
    // Thực hiện lưu thông tin user vào database
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser.insertedId)
    // Gửi email cho người dùng xác thực tài khoản
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Please verify your email before using our service'
    const htmlContent = `
      <h3> Here is your verification link:</j3>
      <h3> ${verificationLink}</j3>
      <h3> Sincerely, <br/> - Lập trình</j3>
    `
    // Gọi tới Provider để gởi mail
    await BrevoProvide.sendEmail(getNewUser.email, customSubject, htmlContent)
    // return trả về dữ liệu cho controller
    return pickUser(getNewUser)
  } catch (error) { throw error }
}

const verifyAccount = async (reqBody) => {
  try {
    //Query user trong database
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')

    // Nếu như mọi thứ oke sẽ bắt đầu cập nhật thông tin user để verify tài khoản
    const updateData = {
      isActive: true,
      verifyToken: null
    }
    // Thực hiện update thông tin user
    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

const login = async (reqBody) => {
  try {
    //Query user trong database
    const existUser = await userModel.findOneByEmail(reqBody.email)

    // Các bước kiểm tra cần thiết
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!bcryptjs.compareSync(reqBody.password, existUser.password)) { // nó sẽ trả về true hoặc false
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is incorrect')
    }

    /** Nếu mọi thứ oke thì bắt đầu tạo Tokens đăng nhập để trả về cho phí FE */
    // Tạo thông tin để đính kèm trong JWT Token bao gồm: _id và email của user
    const userInfor = {
      _id: existUser._id,
      email: existUser.email
    }
    // Tạo ra 2 loại token, accessToken và refreshToken để trả về cho phía FE
    const accessToken = await JwtProvider.generateToken(
      userInfor,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfor,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      // 15
      env.REFRESH_TOKEN_LIFE
    )
    // Trả thông tin user kèm theo 2 cái Token vừa tạo ra
    return { accessToken, refreshToken, ...pickUser(existUser) }
  } catch (error) {
    throw error
  }
}
export const userService = {
  createNew,
  verifyAccount,
  login,
  // refreshToken,
  // update
}