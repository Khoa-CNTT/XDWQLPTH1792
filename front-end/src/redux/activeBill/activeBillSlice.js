import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentBills: null
}

// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBillsByRoomIdAPI = createAsyncThunk(
  'bills/fetchBillsByRoomIdAPI',
  async (roomId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/bills`, {
      params: { roomId }
    })
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)
export const updateBillAPI = createAsyncThunk(
  'bills/updateBillAPI',
  async ({ billId, data }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/bills/${billId}`, data)
    // Lưu ý: axios sẽ trả kết quả về qua property của nó là data
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const billsSlice = createSlice({
  name: 'bills',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    clearCurrentBills: (state, action) => {
      state.currentBills = null
    },
    updateCurrentBills: (state, action) => {
      state.currentBills = action.payload
    },
    // Thêm mới 1 cái bản ghi notification vào trong đầu mảng
    removeBill: (state, action) => {
      const incomingBill = action.payload
      state.currentBills = state.currentBills.filter(
        (item) => !incomingBill.includes(item._id)
      )
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBillsByRoomIdAPI.fulfilled, (state, action) => {
      let incomingBills = action.payload
      // Đoạn này ngược lại với mảng invations nhận được, đơn giản là để hiển thị cái mới nhất lên đầu
      state.currentBills = incomingBills
    }),
      builder.addCase(updateBillAPI.fulfilled, (state, action) => {
        let updatedBill = action.payload
        // Đoạn này ngược lại với mảng invations nhận được, đơn giản là để hiển thị cái mới nhất lên đầu
        state.currentBills = updatedBill

      })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại
//  dữ liệu thông qua reducer (chạy đồng bộ)

// Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản
//  là được thằng redux tạo tự động theo tên của reducer nhé.
export const { clearCurrentBills, updateCurrentBills, addBill, removeItilities } = billsSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentBills = (state) => {
  return state.bills.currentBills
}

// Cái file này tên là activehostelSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activehostelSlice.reducer
export const billsReducer = billsSlice.reducer