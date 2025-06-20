import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import Home from './pages/Home/Home'
import Manage from './pages/Manage/Manage'
import InforRoom from './pages/InforRoom/InforRoom'
import Profile from './pages/Home/Personal-Page/Personal-Page'
import HouesPage from './pages/Home'
import ManagerID from './pages/Home/ChatPage/ManagerID'
import SecurityTab from './pages/Securiry/Security'
import BillPaymentPage from './pages/BillPaymentPage/BillPaymentPage'
import ReturnVnpay from './pages/BillPaymentPage/ReturnVNPay'
import MyContractsPage from './pages/MyContract/MyContractsPage'
import RepairRequestForm from './pages/RepairRequestPage/RepairRequest'

import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
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
        <Route path='/manage/contracts' element={<Manage />}/>
        <Route path='/manage/infor-user' element={<Manage />} />
        <Route path='/manage/utility' element={<Manage />} />
        <Route path='/manage/hostel' element={<Manage />} />
        <Route path='/manage/accounts' element={<Manage />} />
        <Route path='/manage/bills' element={<Manage />} />
        <Route path='/manage/request' element={<Manage />} />
        <Route path='/manage/reports' element={<Manage />} />
        <Route path='/manage/facility' element={<Manage />} />
        <Route path='/manage/hostel/:hostelId' element={<Manage />} />
        <Route path='/infor-room/:roomId' element={<InforRoom />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/hostel' element={<HouesPage />} />
        <Route path='/contracts' element={<MyContractsPage />} />
        <Route path='/repair-request' element={<RepairRequestForm />} />
        <Route path='/home/message' element={<ManagerID />} />
        <Route path='/home/message/:conversationId' element={<ManagerID />} />
        <Route path='/payment/return_vnpay' element={<ReturnVnpay />} />
        <Route path='/payment' element={<BillPaymentPage />} />
        <Route path="/security" element={<SecurityTab />} />
      </Route>
      {/** Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      <Route path='/generate-password' element={<Auth />} />
      <Route path='/account/verification' element={<AccountVerification />} />
      {/** 404 not found page */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
