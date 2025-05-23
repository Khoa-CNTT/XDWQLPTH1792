import axios from 'axios'
import { toast } from 'react-toastify'

import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI } from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'

/**
 * Không thể import { store } from '~/redux/store' theo cách thông thường ở đây
  * Giải pháp: Inject store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component như
  file authorizeAxios hiện tại
  * Hiểu đơn giản: khi ứng dụng bắt đầu chạy lên, code sẽ chạy vào main.jsx đầu tiên, từ bên đó chúng ta gọi hàm
  injectStore ngay lập tức đểgán biến mainStore vào biến axiosReduxStore cục bộ trong file này.
  * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}
// Khởi tạo một đối tượng Axios (authorizeAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizeAxiosInstance = axios.create()
// Thời gian tối đa của 1 request là 10p
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động gởi cookie trong mỗi request lên BE ( phục vụ việc chúng ta
//  lưu JWT tokens(refresh & access)) vào trong httpOnly Cookie của trình duyệt
authorizeAxiosInstance.defaults.withCredentials = true

/** Cấu hình interceptors ( Bộ đánh chặn vào giữa mọi Request và Response ) 
 * Link ở doc axios phần interceptors
*/
// Add a request interceptor
// Interceptor Request: Can thiệp vào giữa những cái request API
authorizeAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click (Xem kỹ mô tả ở file formatters chứa function)
  interceptorLoadingElements(true)


  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích của tạo Promise này dể khi nào gọi api_refresh_token xong xuôi thì mới retry lại nhiều api lỗi trước đó
let refreshTokenPromise = null
// Interceptor Response: Can thiệp vào giữa những cái Response API
authorizeAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click (Xem kỹ mô tả ở file formatters chứa function)
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Mọi mã http status code nằm ngoài khoảng 200-299 là error sẽ rơi vào đây

  // Kỹ thuật chặn spam click (Xem kỹ mô tả ở file formatters chứa function)
  interceptorLoadingElements(false)
  /** Quan trọng: Xử lý refresh token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE. thì gọi API đăng xuất luôn
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì goi api refresh Token để làm mới lại accessToken
  // Đầu tiên lấy được cái req api bị lỗi thông qua error.config
  const originalRequests = error.config
  console.log('originalRequests:', originalRequests)
  if (error.response?.status === 410 && !originalRequests._retry) {
    // Gán thêm một giá trị _retry luôn = true trong khoảng thời gian chờ, đảm bảo việc refresh token này chỉ luôn gọi 1 lần
    //tại 1 thời điêmr (  nhìn lại đk if ở phía trên)
    originalRequests._retry = true

    // Kiểm tra nếu chưa có refreskTokenPromise thì thực hiện gán việc gọi api refresh_token đồng thời gán vào cho cái refreshTokenPromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          // Đồng thời accessToken đã nằm trong httpOnly cookie (Xửu lý từ phía Back_end )
          return data?.accessToken
        })
        .catch((_error) => {
          // Nếu nhận bất kì lỗi nào từ api refresh token thì cứ logout luôn
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          // Dù API có oke hay lỗi thì vẫn luôn gán lại refreshTokenPromise về null như ban đầu
          refreshTokenPromise = null
        })
    }
    // Cần return trường hợp refreshTokenPromise chạy thành công và xử lý thêm ở đây:
    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      /**
       * Bước 1: Đối với Trường hợp nếu dự án cần lưu accessToken vào localstorage hoặc đâu đó thì sẽ viết thêm code xử lý ở đây.
       * Hiện tại ở đây không cần bước 1 này vì chúng ta đã đưa accessToken vào cookie (xử lý từ phía BE) sau khi
      api refreshToken được gọi thành công.
       */

      // Bước 2: Bước Quan trọng: Return lại axios instance của chúng ta kết hợp các originalRequests để gọi lại những api ban đầu bị lỗi

      return authorizeAxiosInstance(originalRequests)
    })
  }


  // Xư lý tập trung phần hiển thị thông báo từ nơi trả vè API ở đây (viết code một lần. Clean Code)
  // console.log error ra là sẽ thấy cấu trúc data dẫn tới lỗi message lỗi như này
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kể mọi lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ tự động refresh token
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})
export default authorizeAxiosInstance