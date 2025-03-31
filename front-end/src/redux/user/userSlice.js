import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentUser: null
}

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const respone = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully')
    }
    return respone.data
  }
)
// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const respone = await authorizeAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return respone.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái response.data trả về ở trên fetchBoardDetailsAPI
      const user = action.payload

      // Update lại dữ liệu của currentAcitiveBoard
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      /**
       * API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
       * Kết hợp ProtectedRoute đã làm ở App.jsx => code sẽ điều hướng chuẩn trang login
       */
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại
//  dữ liệu thông qua reducer (chạy đồng bộ)

// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản
//  là được thằng redux tạo tự động theo tên của reducer nhé.
// export const {} = userSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// Cái file này tên là activeBoardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer