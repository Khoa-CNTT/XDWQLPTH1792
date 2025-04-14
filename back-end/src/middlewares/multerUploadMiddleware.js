import { StatusCodes } from 'http-status-codes'
import multer from 'multer'
import ApiError from '~/utils/ApiError'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES} from '~/utils/validators'
//** Hầu hết những thức ở dưới có ở doc của multer, chỉ là anh tổ chức sao cho khoa học và ngắn gọn  nhất có thể  */

// Function Kiểm tra loại file nào được chấp nhận
const customFileFilter = (req, file, callback) => {

  // Đối với thằng multer kiểm tra kiểu file thì sử dụng mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage), null)
  }
  // Nếu như kiểu file hợp lệ:
  return callback(null, true)
}

// Khởi tạo function upload được tạo bởi thằng multer

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter
})

export const multerUploadMiddeware = {
  upload
}