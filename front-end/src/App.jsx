import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Home from './pages/Home/Home'
import Manage from './pages/Manage/Manage'
import InforRoom from './pages/InforRoom/InforRoom'
import Profile from './pages/Home/Personal-Page/Personal-Page'
import HouesPage from './pages/Home'
import DetailUser from './pages/Home/DetailUser/DetailInfroUser'
import RoomStatus from './pages/Home/RoomStatus/RoomStatus'
import DetailRoom from './pages/Home/RoomStatus/DetailRoom'
import ManagerID from './pages/Home/ChatPage/ManagerID'
import SecurityTab from './pages/Securiry/Security'


import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import SPDetailUser from './pages/Home/DetailUser/SPDetailUser'
/**
* Giải pháp Clean Code trong việc xác định các route nào cần đăng nhập tài khoản xong thì mới cho truy cập
* Sử dụng <Outlet /> của react-router-dom để hiển thị các Child Route (xem cách sử dụng trong App() bên dưới)

* https://reactrouter.com/en/main/components/outlet
* Một bài hướng dẫn khá đầy đủ:
  https://www.robinwieruch.de/react-router-private-routes/
 */
const ProtectedRoute = ({ user }) => {
  if (!user) return <Navigate to='/login' replace={true} />
  return <Outlet />
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (
    <Routes>
      <Route path='/' element={<Navigate to="/hostel" replace={true} />} />

      {/* Protected Route( hiểu cách đơn giản của chúng là những route chỉ cho truy cập sau khi đã login) */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        <Route path='/hostel/:hostelId' element={<Home />} />
        <Route path='/manage/Contracts' element={<Manage />}/>
        <Route path='/manage/infor-user' element={<Manage />} />
        <Route path='/manage/hostel' element={<Manage />} />
        <Route path='/manage/hostel/:hostelId' element={<Manage />} />
        <Route path='/infor-room/:roomId' element={<InforRoom />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/hostel' element={<HouesPage />} />
        <Route path='/home/message' element={<ManagerID />} />
        <Route path='/home/message/:conversationId' element={<ManagerID />} />
        <Route path='/home/DetailInforUser' element={<DetailUser />} />
        <Route path='/home/SPDetailUser' element={<SPDetailUser />} />
        <Route path='/home/RoomStatus' element={<RoomStatus />} />
        <Route path="/room/:id" element={<DetailRoom />} />
        <Route path="/room/new" element={<DetailRoom />} />
        <Route path="/security" element={<SecurityTab />} />
      </Route>
      {/** Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />
      {/** 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
