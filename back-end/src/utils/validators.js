export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const INPUT_NAME =/^[a-zA-ZÀ-ỹ\s]+$/
export const INPUT_NAME_MESSAGE = 'Họ và tên không được nhập số.'
export const PHONE_NUMBER_RULE = /^[0-9]{9,10}$/
export const NUMBER_RULE_MESSAGE = 'Phải là chữ chữ số và 9 số'
export const CITIZEN_NUMBER = /^\d{12}$/
export const CITIZEN_NUMBER_MESSAGE = 'Phải là 12 số'
export const FIELD_REQUIRED_MESSAGE = 'This field is required.'
export const EMAIL_RULE = /^\S+@\S+\.\S+$/
export const EMAIL_RULE_MESSAGE = 'Email is invalid.'
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d\W]{8,256}$/
export const PASSWORD_RULE_MESSAGE = 'Password must include at least 1 letter, a number, and at least 8 characters.'
// Rule định nghĩa ngày
export const DATE_RULE = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/
export const DATE_RULE_MESSAGE = 'Ngày được định dạng sai'
export const MONTH_YEAR_RULE = /^(0[1-9]|1[0-2])\/(19|20)\d{2}$/
export const MONTH_YEAR_RULE_MESSAGE = 'Tháng năm định dạng không đúng'
// Liên quan đến validate file
export const LIMIT_COMMON_FILE_SIZE = 10485760 // byte = 10 MB
export const ALLOW_COMMON_FILE_TYPES = ['image/jpg', 'image/jpeg', 'image/png']