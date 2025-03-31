// Lưu ý Brevo là tên thương hiệu mới của sib -Sendinblue
// Vì thế trong phần hướng dẫn trên github có thể nó còn giữ tên biến SibApiV3Sdk
const SibApiV3Sdk = require('@getbrevo/brevo')
import { env } from '~/config/environment'


let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) =>{
  // Khởi tạo một cái sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail()

  // Tài khoản gửi mail: Lưu ý địa chỉ email phải là cái email mà các bạn tạo tài khoản trên Brevo
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Những tài khoản nhận email
  // 'to' phải là một Array để sau chúng ta có thể tùy biến gởi email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]
  // Tiêu đề của email:
  sendSmtpEmail.subject = customSubject
  // Nội dung email dang HTML
  sendSmtpEmail.htmlContent = htmlContent

  // Gọi hành động gửi mail
  // More Inf : thằng sendTransacEmail của thư viên nó sẽ trả về 1 Promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvide ={
  sendEmail
}