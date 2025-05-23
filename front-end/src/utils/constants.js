let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-lh59.onrender.com'
}
export const API_ROOT = apiRoot

export const DEFAULT_MESSAGES = 1
export const DEFAULT_ITEMS_PER_MESSAGES = 10
export const USER_ROLES = {
  CLIENT: 'client',
  LANDLORD: 'landlord',
  ADMIN: 'admin'
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
export const REQUETS_STATUS = {
  PENDING: 'Đang xử lý',
  ACCEPTED: 'Chấp nhận',
  REJECTED: 'Từ chối'
}
export const FACILITY_CONDITION = {
  GOOD: 'Còn tốt',
  NEED_REPAIR: 'Cần sửa',
  BROKEN: 'Hỏng'
}
export const BILL_STATUS = {
  PENDING: 'Chưa thanh toán',
  SUCCESS: 'Đã thanh toán'
}
export const STATUS_ROOM = {
  AVAILABLE: 'Còn trống',
  OCCUPIED: 'Đã thuê', //Đã thuê
  MAINTENANCE: 'Đã đặt cọc' // đã đặt cọc
}
export const districtsInDaNang = [
  {
    name: 'Quận Hải Châu',
    wards: [
      'Phước Ninh', 'Hòa Thuận Tây', 'Hòa Thuận Đông', 'Nam Dương', 'Bình Hiên', 'Bình Thuận',
      'Thạch Thang', 'Hải Châu I', 'Hải Châu II', 'Thanh Bình', 'Thuận Phước', 'Hòa Cường Bắc', 'Hòa Cường Nam'
    ]
  },
  {
    name: 'Quận Thanh Khê',
    wards: [
      'Tam Thuận', 'Thanh Khê Tây', 'Thanh Khê Đông', 'Xuân Hà', 'Tân Chính', 'Thạc Gián',
      'An Khê', 'Chính Gián', 'Vĩnh Trung', 'Hòa Khê'
    ]
  },
  {
    name: 'Quận Sơn Trà',
    wards: [
      'An Hải Bắc', 'An Hải Đông', 'An Hải Tây', 'Mân Thái', 'Nại Hiên Đông',
      'Phước Mỹ', 'Thọ Quang'
    ]
  },
  {
    name: 'Quận Ngũ Hành Sơn',
    wards: [
      'Khuê Mỹ', 'Mỹ An', 'Hòa Hải', 'Hòa Quý'
    ]
  },
  {
    name: 'Quận Liên Chiểu',
    wards: [
      'Hòa Minh', 'Hòa Khánh Bắc', 'Hòa Khánh Nam', 'Hòa Hiệp Bắc', 'Hòa Hiệp Nam'
    ]
  },
  {
    name: 'Quận Cẩm Lệ',
    wards: [
      'Khuê Trung', 'Hòa Thọ Đông', 'Hòa Thọ Tây', 'Hòa An', 'Hòa Phát', 'Hòa Xuân'
    ]
  },
  {
    name: 'Huyện Hòa Vang',
    wards: [
      'Hòa Bắc', 'Hòa Liên', 'Hòa Ninh', 'Hòa Sơn', 'Hòa Nhơn', 'Hòa Phú',
      'Hòa Phong', 'Hòa Châu', 'Hòa Tiến', 'Hòa Phước'
    ]
  },
  {
    name: 'Huyện đảo Hoàng Sa',
    wards: [
      'Hoàng Sa' // quản lý hành chính không có phân chia phường, chỉ một đơn vị
    ]
  }
]