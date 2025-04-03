/**
 * TrungQuanDev: https://youtube.com/@trungquandev
 */

// Một vài biểu thức chính quy - Regular Expression và custom message.
// Về Regular Expression khá hại não: https://viblo.asia/p/hoc-regular-expression-va-cuoc-doi-ban-se-bot-kho-updated-v22-Az45bnoO5xY
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email không hợp lệ.'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password phải bao gồm chữ, số và ít nhất 8 kí tự.'
export const PASSWORD_CONFIRMATION_MESSAGE = 'Password Confirmation does not match!'
export const INPUT_NAME =/^[a-zA-ZÀ-ỹ\s]+$/
export const INPUT_NAME_MESSAGE = 'Họ và tên không được nhập số.'
export const PHONE_NUMBER_RULE = /^[0-9]{9,10}$/
export const NUMBER_RULE_MESSAGE = 'Phải là chữ chữ số và 9 số'
export const CITIZEN_NUMBER = /^\d{12}$/
export const CITIZEN_NUMBER_MESSAGE = 'Phải là 12 số'

// Liên quan đến Validate File
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']
export const singleFileValidator = (file) => {
  if (!file || !file.name || !file.size || !file.type) {
    return 'File cannot be blank.'
  }
  if (file.size > LIMIT_COMMON_FILE_SIZE) {
    return 'Maximum file size exceeded. (10MB)'
  }
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.type)) {
    return 'File type is invalid. Only accept jpg, jpeg and png'
  }
  return null
}
