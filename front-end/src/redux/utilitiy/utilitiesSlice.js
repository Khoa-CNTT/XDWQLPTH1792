import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentUtilities: null
}

// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchUtilitiesByHostelIdAPI = createAsyncThunk(
  'utilities/fetchUtilitiesByHostelIdAPI',
  async (hostelId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/utilities`, {
      params: hostelId
    })
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const utilitiesSlice = createSlice({
  name: 'utilities',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    clearCurrentUtilities: (state, action) => {
      state.currentUtilities = null
    },
    updateCurrentUtilities: (state, action) => {
      state.currentUtilities = action.payload
    },
    // Thêm mới 1 cái bản ghi notification vào trong đầu mảng
    removeItilities: (state, action) => {
      const incomingUtility = action.payload
      state.currentUtilities = state.currentUtilities.filter(
        (item) => !incomingUtility.includes(item._id)
      )
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchUtilitiesByHostelIdAPI.fulfilled, (state, action) => {
      let incomingUtilitys = action.payload
      // Đoạn này ngược lại với mảng invations nhận được, đơn giản là để hiển thị cái mới nhất lên đầu
      state.currentUtilities = incomingUtilitys
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại
//  dữ liệu thông qua reducer (chạy đồng bộ)

// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản
//  là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentUtilities, updateCurrentUtilities, addUtility, removeItilities } = utilitiesSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentUtilities = (state) => {
  return state.utilities.currentUtilities
}

// Cái file này tên là activehostelSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activehostelSlice.reducer
export const utilitiesReducer = utilitiesSlice.reducer