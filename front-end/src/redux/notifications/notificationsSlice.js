import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentNotifications: null
}

// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchInvitationsAPI = createAsyncThunk(
  'notifications/fetchInvitationAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)
export const updateHostelInvitationAPI = createAsyncThunk(
  'notifications/updateHostelInvitationAPI',
  async ({ status, invitationId } ) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/hostel/${invitationId}`, {status})
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    clearCurrentNotifications: (state, action) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications = action.payload
    },
    // Thêm mới 1 cái bản ghi notification vào trong đầu mảng
    addNotification: (state, action) => {
      const incomingInvitation = action.payload
      state.currentNotifications.unshift(incomingInvitation)
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // Đoạn này ngược lại với mảng invations nhận được, đơn giản là để hiển thị cái mới nhất lên đầu
      state.currentNotifications = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    })
    builder.addCase(updateHostelInvitationAPI.fulfilled, (state, action) => {
      let incomingInvitations = action.payload
      // Cập nhật lại dữ liệu hostelInvitation ( bên trong nó sẽ có Status mới sau khi update)
      const getInvitation = state.currentNotifications.find(i => i._id === incomingInvitations._id)
      getInvitation.hostelInvitation = incomingInvitations.hostelInvitation
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại
//  dữ liệu thông qua reducer (chạy đồng bộ)

// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản
//  là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentNotifications = (state) => {
  return state.notifications.currentNotifications
}

// Cái file này tên là activehostelSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activehostelSlice.reducer
export const notificationsReducer = notificationsSlice.reducer