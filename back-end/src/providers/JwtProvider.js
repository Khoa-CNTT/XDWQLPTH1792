import JWT from 'jsonwebtoken'


/**
 * Function tạo mới token - cần 3 tham số đầu vào
 * userInfor: Những thông tin muốn đính kèm vào token
 * secrectSignature: Chữ ký bí mật ( dạng một chuỗi string ngẫu nhiên) trên docs thì để tên privateKey tùy đều được
 * tolenLife: Thời gian sống của token
 */
const generateToken = async (userInfor, secrectSignature, tokenLife) => { // tạo token
  try {
    // Hàm sign() của thư viện JWT - Thuật toán mặc định là HS256 nhé, cứ cho vào code cho dễ nhìn
    return JWT.sign(userInfor, secrectSignature, { algorithm: 'HS256', expiresIn: tokenLife}) //algorithm: thuật toán
  } catch (error) {
    throw new Error(error.message)
  }
}
/**
 * Function kiểm tra một token có hợp lệ hay không
 * Hợp lệ ở đây hiểu đơn giản là cái token được tạo ra đúng với chữ ký bí mật secrectSignature trong dự án hay không
 */
const verifyToken = async (token, secrectSignature) => { // xác thực token
  try {
    // hàm verify của thư viện JWT
    return JWT.verify(token, secrectSignature)
  } catch (error) {
    throw new Error(error.message)
  }
}

export const JwtProvider ={
  generateToken,
  verifyToken
}