import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

/**
 * Lưu ý: Đối với việc sử dụng axios ở khóa MERN Stack Pro trên kênh YouTube: TrungQuanDev – Một Lập Trình Viên
 * Tất cả các function bên dưới các bạn sẽ thấy mình chỉ request và lấy data từ response luôn, mà không có try catch hay 
 * then catch gì để bắt lỗi.
 * Lý do là vì ở phía Front-end chúng ta không cần thiết làm như vậy đối với mọi request bởi nó sẽ gây ra việc
 * dư thừa code catch lỗi quá nhiều.
 * Giải pháp Clean Code gọn gàng đó là chúng ta sẽ catch lỗi tập trung tại một nơi bằng cách tận dụng một thứ
 * cực kỳ mạnh mẽ trong axios đó là Interceptors
 * Hiểu đơn giản Interceptors là cách mà chúng ta sẽ đánh chặn vào giữa request hoặc response để xử lý logic mà 
 * chúng ta muốn.
 * (Và ở học phần MERN Stack Advance nâng cao học trực tiếp mình sẽ dạy cực kỳ đầy đủ cách xử lý, áp dụng phần
 * này chuẩn chỉnh cho các bạn.)
 */
// Boards
// Đã move vào redux
// export const fetchBoardDetailsAPI = async (boardId) => {
//   const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
//   // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
//   return response.data
// }
// Hostel
export const createNewHostelAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/hostel`, data)
  return respone.data
}
export const fetchHostelsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/hostel`)
  return response.data
}

export const uploadImagesAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/hostel/uploadImages`, data)
  return respone.data
}
export const updateHostelAPI = async (hostelId, updateData) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/hostel/${hostelId}`, updateData)
  return respone.data
}
export const deleteHostelAPI = async (data) => {
  const respone = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/hostel`, {
    params: data // Truyền dữ liệu qua params
  })
  return respone.data
}
export const getAllHostelPublic = async () => {
  const respone = await authorizeAxiosInstance.get(`${API_ROOT}/v1/hostel/public`)
  return respone.data
}
export const findHostelsAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/hostel/public`, data)
  return respone.data
}
//Rooms
export const createNeRoomAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/rooms`, data)
  return respone.data
}
export const deleteRoomAPI = async (data) => {
  const respone = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/rooms`, {
    params: data // Truyền dữ liệu qua params
  })
  return respone.data
}
export const updateRoomAPI = async (roomId, updateData) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/rooms/${roomId}`, updateData)
  return respone.data
}
export const pullTenantFromRoomAPI = async (updateData) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/rooms/pullTenant`, updateData)
  return respone.data
}
// User
export const registerUserAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' }
  )
  return respone.data
}
export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our service!',
    { theme: 'colored' }
  )
  return response.data
}
export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}
// Invite API
export const inviteUserToHostelAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/invitations/hostel`, data)
  toast.success('Mời thành công')
  return response.data
}
// Conversation Api
export const createNewConversationAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/conversations`, data)
  return response.data
}
export const fetchConversationsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/conversations`)
  return response.data
}
// Message API
export const createNewMessaggeAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/messages`, data)
  return response.data
}
export const fetchMessagesAPI = async (data) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/messages`, {
    params: data
  })
  return response.data
}
// Contract API
export const createNewContractAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/contracts`, data)
  return response.data
}
export const fetchContractsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/contracts`)
  return response.data
}
// Utilities API
export const createNewUtilityAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/utilities`, data)
  return response.data
}
export const deleteUtilityAPI = async (data) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/utilities`, {
    params: data // Truyền dữ liệu qua params
  })
  return response.data
}