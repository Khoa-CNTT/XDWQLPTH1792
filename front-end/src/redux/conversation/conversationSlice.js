import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentConversation: null
}

// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchConversationDetailsAPI = createAsyncThunk(
  'conversation/fetchConversationDetailsAPI',
  async (conversationId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/conversations/${conversationId}`)
    return response.data
  }
)
export const deleteConversationAPI = createAsyncThunk(
  'conversation/deleteConversationAPI',
  async (conversationId) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/conversations/${conversationId}`)
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    updateCurrentConversation: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó vào 1 biến có ý nghĩa hơn
      let conversation = action.payload
      // Xử lý dữ liệu nếu cần thiết...
      // Update lại dữ liệu của currentConversation
      state.currentConversation = {
        ...state.currentConversation,
        lastMessage: conversation.lastMessage
      }
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchConversationDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái response.data trả về ở trên fetchConversationDetailsAPI
      const conversation = action.payload

      // Xử lý dữ liệu nếu cần thiết...

      // Update lại dữ liệu của currentConversation
      state.currentConversation = conversation
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)

/** Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo
 tên của reducer nhé.*/
export const { updateCurrentConversation } = conversationSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentConversation = (state) => {
  return state.conversation.currentConversation
}

// Cái file này tên là BoardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default BoardSlice.reducer
export const conversationReducer = conversationSlice.reducer