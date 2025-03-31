import { configureStore } from '@reduxjs/toolkit'
import { userReducer } from './user/userSlice'
import { activeHostelReducer } from './activeHostel/activeHostelSlice'
/**
 * Cấu hình redux-persist
 * https://www.npmjs.com/package/redux-persist
 * 
 * Bài viết hướng dẫn này dễ hiểu hơn:
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import { combineReducers } from 'redux' // lưu ý chúng ta có sẵn redux trong node_modules bởi vì @reduxjs/toolkit là đã có luôn
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // default là localstorage

// Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, // Biến của storage ở trên, lưu vào localstogare
  whiteList: ['user'] //  Định nghĩa các slice dữ liệu được phép truy cập qua mỗi lần f5 trình duyệt
  // blackList: ['user'] // Định nghĩa  các SLice không được phép duy trì qua mỗi lần f5 trình duyệt
}
// Combine các reducers trong dự án chúng ta ở đây
const reducers = combineReducers({
  activeHostel:activeHostelReducer,
  user: userReducer
})
// Thực hiện persist Reducer
const persistedReducers = persistReducer(rootPersistConfig, reducers)
export const store = configureStore({
  reducer: persistedReducers,
  //Fix warning error when implement redux-persist
  //https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck:false})
})