import { toast } from 'react-toastify'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Hostel
export const createNewHostelAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/hostel`, data)
  return respone.data
}
export const fetchHostelsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/hostel`)
  return response.data
}
export const fetchHostelsByOwnerIdAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/hostel/owner`)
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
  toast.success('Tài khoản đã tạo thành công. Vui lòng xem và xác thực trong email!',
    { theme: 'colored' }
  )
  return respone.data
}
export const verifyUserAPI = async (data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/verify`, data)
  toast.success('Tài khoản đã xác thực thành công! Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ!',
    { theme: 'colored' }
  )
  return response.data
}
export const refreshTokenAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users/refresh_token`)
  return response.data
}

export const fetchAllAccountsAPI = async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/users`)
  return response.data
}

export const updateAccountAPI = async (userId, updateData) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/${userId}`, updateData)
  return respone.data
}
export const deleteAccountAPI = async (userId) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/deletAccount/${userId}`)
  return respone.data
}
export const generatePasswordAPI = async (data) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/generatePassword`, data)
  return respone.data
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
export const updateContractAPI = async (contractId, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/contracts/${contractId}`, data)
  return response.data
}
// Utilities API
export const createNewUtilityAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/utilities`, data)
  return response.data
}
export const fetchUtilitiesByRoomIdAPI = async (data) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/utilities/room`, {
    params: data
  })
  return response.data
}
export const deleteUtilityAPI = async (data) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/utilities`, {
    params: data // Truyền dữ liệu qua params
  })
  return response.data
}
// bills API
export const fetchBillsByHostelIdAPI = async (data) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/bills/hostel`, {
    params: data
  })
  return response.data
}
export const createNewBillAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/bills`, data)
  return response.data
}
export const updateBillAPI = async (billId, updateData) => {
  const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/bills/${billId}`, updateData)
  return respone.data
}
export const deleteBillAPI = async (data) => {
  const respone = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/bills`, {
    params: data // Truyền dữ liệu qua params
  })
  return respone.data
}
//Payment api
export const checkVNPayResultAPI = async (data) => {
  const respone = await authorizeAxiosInstance.get(`${API_ROOT}/v1/payments/return_vnpay`, {
    params: data // Truyền dữ liệu qua params
  })
  return respone.data
}
export const createPaymentAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/payments/create_payment`, data)
  return respone.data
}
export const getListPaymentsAPI = async (data) => {
  const respone = await authorizeAxiosInstance.get(`${API_ROOT}/v1/payments/getListPayment`, {
    params : data
  })
  return respone.data
}
//Facility API
export const createNewFacilityAPI = async (data) => {
  const respone = await authorizeAxiosInstance.post(`${API_ROOT}/v1/facilities`, data)
  return respone.data
}
export const fetchFacilitiesByHostelId = async (data) => {
  const respone = await authorizeAxiosInstance.get(`${API_ROOT}/v1/facilities`, {
    params : data
  })
  return respone.data
}
export const deleteFacilityAPI = async (id) => {
  const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/facilities/${id}`)
  return response.data
}
export const updateFacilityAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/facilities/${id}`, data)
  return response.data
}
// Request API
export const createNewRepairRequestAPI = async (data) => {
  const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/requests`, data)
  return response.data
}
export const fetchRequestByHostelId = async (hostelId) => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/requests/hostelId`, {
    params: hostelId
  })
  return response.data
}
export const updateRequestAPI = async (id, data) => {
  const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/requests/${id}`, data)
  return response.data
}