import { env } from '~/config/environment'
// Những cái domains được phép truy cập tới tài nguyên server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' // Không cần localhost nữa vì ở file config/cors đã luôn luôn cho phép môi trường dev(env.BUILD_MODE==='dev)
  //... ví dụ sau này chúng ta sẽ deploy lên domain chính thức
  'https://trello-web-wheat.vercel.app'
]
export const HOSTEL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}
export const STATUS_ROOM = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied', //Đã thuê
  MAINTENANCE: 'maintenance' // đã đặt cọc
}
export const WEBSITE_DOMAIN = (env.BUILD_MODE=== 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT

export const DEFAULT_MESSAGES = 1
export const DEFAULT_ITEMS_PER_MESSAGES = 10

export const INVITATION_TYPES = {
  HOSTEL_INVITATION: 'HOSTEL_INVITATION'
}
export const HOSTEL_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}
export const BILL_STATUS = {
  PENDING: 'Chưa thanh toán',
  SUCCESS: 'Đã thanh toán'
}
export const PAYMENT_STATUS = {
  FAILED: 'Thanh toán thất bại',
  SUCCESS: 'Thanh toán thành công'
}
export const CONSTRACT_STATUS = {
  ACTIVE: 'Đang hiệu lực',
  EXPIRED: 'Đã hết hạn',
  CANCELED: 'Đã hủy'
}
// role user
export const USER_ROLES = {
  CLIENT: 'client',
  LANDLORD:'landlord',
  ADMIN: 'admin'
}