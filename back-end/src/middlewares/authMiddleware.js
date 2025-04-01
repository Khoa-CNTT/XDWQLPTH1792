import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

// Middleware sẽ đảm nhận việc quan trọng : Xác thực tài khoản JWT accessToken nhận được từ phía FE có hợp lệ hay không
const isAuthorized = async (req, res, next ) => {
  // lấy accessToken nằm trong request cookies phía Client-  withCredentials trong file authorizeAxios
  const clientAccessToken = req.cookies?.accessToken
  // Nếu như clientAccessToken không tồn tại thì trả về lỗi
  if (!clientAccessToken) {
    next( new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized ! (token not found)'))
    return
  }

  try {
    //  B1: Thực hiện giải mã token xem nó có hợp lệ hay không
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, env.ACCESS_TOKEN_SECRET_SIGNATURE)
    // console.log('accessTokenDecoded', accessTokenDecoded)
    /** B2: Quan trọng: Nếu như token hợp lệ, thì phải lưu thông tin giải mã được vào cái req.jwtDecoded, để sử dụng cho các tầng
    cần xử lý phía sau */
    req.jwtDecoded = accessTokenDecoded
    // B3: Cho phép req đi tiếp
    next()
  } catch (error) {
    // Nếu như accessToken bị hết hạn (expried) thì mình cần trả về một cái mã lỗi GONE-410 cho phía FE để gọi API refreshToken
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token'))
      return
    }
    // Nếu như accessToken không hợp lệ do bất kỳ điều gì khác vụ hết hạn thì chúng ta cứ thẳng tay trả về mã 401 cho phía FE gọi api sign_out luôn
    next( new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized !'))
  }
}

export const authMiddleware = { isAuthorized }