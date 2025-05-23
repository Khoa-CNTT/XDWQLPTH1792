import { isEqual } from 'lodash'
export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCar: true
  }
}
// Kỹ thuật dùng css pointer-event để chặn user spam click tại bất kỳ chỗ nào có hành động click gọi api
// Đây là một kỹ thuật rất hay tận dụng Axios Interceptors và CSS Pointer-events để chỉ phải viết code xử lý một lần cho toàn bộ dự án
// Cách sử dụng: Với tất cả các link hoặc button mà có hành động gọi api thì thêm class "interceptor-loading" cho nó là xong.
export const interceptorLoadingElements = (calling) => {
  // DOM lấy ra toàn bộ phần tử trên page hiện tại có className là 'interceptor-loading'
  const elements = document.querySelectorAll('.interceptor-loading')
  for (let i = 0; i < elements.length; i++) {
    if (calling) {
      // Nếu đang trong thời gian chờ gọi API (calling === true) thì sẽ làm mờ phần tử và chặn click bằng css pointer-events
      elements[i].style.opacity = '0.5'
      elements[i].style.pointerEvents = 'none'
    } else {
      // Ngược lại thì trả về như ban đầu, không làm gì cả
      elements[i].style.opacity = 'initial'
      elements[i].style.pointerEvents = 'initial'
    }
  }
}
// Viết hoa tất cả chữ
export const toUpperCaseAll = (str) => {
  return str.toUpperCase()
}

// Hàm tính thời gian hiển thị
export const calculateTimeAgo = (timestamp) => {
  const now = new Date()
  const diff = Math.floor((now - new Date(timestamp)) / 60000) // Tính chênh lệch phút
  if (diff < 1) return 'Vừa xong'
  if (diff < 60) return `${diff} phút trước`
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  return `${days} ngày trước`
}
// di chuyển 1 phần tử đã biết lên đầu mảng
export const moveToTop = (array, element) => {
  const index = array.findIndex(convo => convo._id === element)
  if (index > -1) {
    const [item] = array.splice(index, 1)
    array.unshift(item)
  }
  return array
}
// So sánh 2 dữ liệu khi update
export const compareData = (dataPre, dataCur) => {

  const dataToCompare = {
    ...dataPre,
    ...dataCur
  }
  return isEqual(dataPre, dataToCompare)
}