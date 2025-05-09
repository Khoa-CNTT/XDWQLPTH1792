import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { API_ROOT } from '~/utils/constants'

import authorizeAxiosInstance from '~/utils/authorizeAxios'
// Khởi tạo giá trị State của 1 cái slice trong redux
const initialState = {
  currentActiveRoom: null
}

// Các hành động gọi api ( bất đồng bộ ) và cập nhật dữ liệu vào redux, dùng middleware và createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchRoomDetailsAPI = createAsyncThunk(
  'activeRoom/fetchRoomDetailsAPI',
  async (roomId) => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/rooms/${roomId}`)
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ Redux Store
export const activeRoomSlice = createSlice({
  name: 'activeRoom',
  initialState,
  //Reducers Nơi xử lý dữ liệu dồng bộ
  reducers: {
    // Lưu ý luôn luôn cần cập ngoặc nhọn cho function trong reducer cho dù bên trong chỉ có 1 dòng, đây là rule của redux
    updateCurrentActiveRoom: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó vào 1 biến có ý nghĩa hơn
      let room = action.payload

      // Xử lý dữ liệu nếu cần thiết...
      state.currentActiveRoom = {
        ...state.currentActiveRoom,
        memberIds : room.memberIds
      }
      // Update lại dữ liệu của currentActiveRoom
      state.currentActiveRoom = room
    }
  },
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchRoomDetailsAPI.fulfilled, (state, action) => {
      // action.payload ở đây chính là cái response.data trả về ở trên fetchRoomDetailsAPI
      const room = action.payload

      // Xử lý dữ liệu nếu cần thiết...

      // Update lại dữ liệu của currentActiveRoom
      state.currentActiveRoom = room
    })
  }
})

// Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhật lại dữ liệu thông qua reducer (chạy đồng bộ)

/** Để ý ở trên thì không thấy properties actions đâu cả, bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo
 tên của reducer nhé.*/
export const { updateCurrentActiveRoom } = activeRoomSlice.actions

// Selectors: là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệ từ trong kho redux store ra sử dụng
export const selectCurrentActiveRoom = (state) => {
  return state.activeRoom.currentActiveRoom
}

// Cái file này tên là activeBoardSlice. Nhưng chúng ta sẽ export một thứ tên là Reducer, chú ý!!!
// export default activeBoardSlice.reducer
export const activeRoomReducer = activeRoomSlice.reducer