/**
 * YouTube: TrungQuanDev - Một Lập Trình Viên
 * Created by 0dev.com's author on Sep 27, 2023
 */

import { pick } from 'lodash'

/**
 * Simple method to Convert a String to Slug
 * Các bạn có thể tham khảo thêm kiến thức liên quan ở đây: https://byby.dev/js-slugify-string
 */
export const slugify = (val) => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD') // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // remove consecutive hyphens
}
// Lấy một vài dữ liệu củ thể trong user để tránh việc trẳ các dữ liệu nhạy cảm như hash password
export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'displayName', 'avatar', 'role', 'dateOfBirth', 'gender', 'phone', 'address', 'citizenId', 'isActive', 'createdAt', 'updateAt', '_destroy'])
}
export const isFutureOrToday = (dateStr) => {
  const [day, month, year] = dateStr.split('/').map(Number)

  // Tạo đối tượng Date từ input
  const inputDate = new Date(year, month - 1, day) // Tháng bắt đầu từ 0

  // Lấy ngày hiện tại (reset giờ về 00:00:00 để so sánh chính xác)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return inputDate >= today
}