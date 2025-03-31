import { useState, useEffect } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'

import PageLoadingSpiner from '~/components/Loading/PageLoadingSpinner'
import { verifyUserAPI } from '~/apis'
function AccountVerification() {
  // Lấy giá trị email và token từ URL
  let [searchParam] = useSearchParams()
  // 2 cách
  // const email = searchParam.get('email')
  // const token = searchParam.get('token')
  const { email, token } = Object.fromEntries([...searchParam])

  // Tạo 1 biến state(trạng thái) để biết được đã verify tài khoản thành công hay chưa
  const [verified, setVerified] = useState(false)

  // Gọi API để verify tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => setVerified(true))
    }
  }, [email, token])
  // Nếu URL có vấn đề, không tồn tại 1 trong 2 giá trị email hoặc token thì đá ra trang 404 luôn
  if (!email || !token) {
    return <Navigate to="/404"/>
  }
  // Nếu chưa verify xong thì hiện loading
  if (verified) {
    return <PageLoadingSpiner caption="Verifing your account......" />
  }
  // Cuối cùng nếu không gặp vấn đề gì + với verify thành công thì điều hướng về trang login cùng giá trị verifiedEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification