import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentActiveRequests: []
}

// Các hành động gọi api ( bất đồng bộ ) và cập nkhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchRequestDetailsAPI = createAsyncThunk(
  'activeRequests/fetchRequestDetailsAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/requests`)
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const activeRequestsSlice = createSlice({
  name: 'activeRequests',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    updateCurrentActiveRequest: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó vào 1 biến có ý nghĩa hơn
      let request = action.payload
      // Xử lý dữ liệu nếu cần thiết...

      // Update lại dữ liệu của currentActiveRequests
      state.currentActiveRequests = request
    },
    addActiveRequest: (state, action) => {
      const incomingRequest = action.payload
      state.currentActiveRequests.push(incomingRequest)
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchRequestDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái response.data trả về ở trên fetchRequestDetailsAPI
      const requests = action.payload
      // Xử lý dữ liệu nếu cần thiết...
      // Update lại dữ liệu của currentActiveRequests
      state.currentActiveRequests = requests
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)

/** Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo
 tên của reducer nhé.*/
export const { updateCurrentActiveRequest, addActiveRequest } = activeRequestsSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentActiveRequest = (state) => {
  return state.activeRequests.currentActiveRequests
}

// Cái file này tên là activeBoardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activeBoardSlice.reducer
export const activeRequestsReducer = activeRequestsSlice.reducer