import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import { Box, Typography } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ContactMailIcon from '@mui/icons-material/ContactMail'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveRoom, fetchRoomDetailsAPI } from '~/redux/activeRoom/activeRoomSlice'
import { useEffect, useState } from 'react'
import { fetchBillsByHostelIdAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
// Recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { BILL_STATUS } from '~/utils/constants'

// Dữ liệu giả
const unpaidBills = [
  { month: 'Tháng 1', amount: 1200000, dueDate: '10/01/2025' },
  { month: 'Tháng 3', amount: 1250000, dueDate: '10/03/2025' },
  { month: 'Tháng 5', amount: 1300000, dueDate: '10/05/2025' },
]

const consumptionData = [
  { name: 'Tháng 1', dien: 120, nuoc: 30 },
  { name: 'Tháng 2', dien: 150, nuoc: 45 },
  { name: 'Tháng 3', dien: 130, nuoc: 35 },
  { name: 'Tháng 4', dien: 170, nuoc: 50 },
  { name: 'Tháng 5', dien: 140, nuoc: 40 },
];

function InforRoom() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [bills, setBills] = useState(null)
  const room = useSelector(selectCurrentActiveRoom)
  const { roomId } = useParams()
  const user = useSelector(selectCurrentUser)
  useEffect(() => {
    dispatch(fetchRoomDetailsAPI(roomId))
  }, [dispatch, roomId])
  useEffect(() => {
    fetchBillsByHostelIdAPI({ roomId }).then((res) => {
      setBills(res)
    })
  }, [dispatch, roomId])
  const billNew = bills?.filter(bill => bill.status === BILL_STATUS.PENDING)
  console.log('new', billNew)
  const handleToBill = (hostelId, billId) => {
    if (room?.memberIds?.includes(user._id)) {
      navigate(`/payment?hostelId=${hostelId}&billId=${billId}`)
    }
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <Box p={3} gap={2} sx={{
        display: 'flex',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5'),
        height: (theme) => theme.trello.messageHeight
      }}>
        {/* Cột bên trái */}
        <Box sx={{
          width: '50%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/* Thông tin phòng */}
          <Box px={2} sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
            height: '60%',
            borderRadius: '20px',
            overflowY: 'auto',
          }}>
            <Box my={2} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography variant="h5" fontWeight={600}>Căn phòng</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <Typography variant="body1">Số phòng:</Typography>
                  <Typography variant="body2">{room?.roomName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <Typography variant="body1">Diện tích:</Typography>
                  <Typography variant="body2">{room?.length} x {room?.width}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoneyIcon />
                  <Typography variant="body1">Giá thuê:</Typography>
                  <Typography variant="body2">{room?.price?.toLocaleString('vi-VN')}₫</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <Typography variant="body1">Tiện ích:</Typography>
                  <Typography variant="body2">{room?.utilities?.join(', ') || 'Không có thông tin'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <Typography variant="body1">Tình trạng:</Typography>
                  <Typography variant="body2">{room?.status}</Typography>
                </Box>
              </Box>
              <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon />
                  <Typography variant="body1">Người thuê:</Typography>
                  <Typography variant="body2">{room?.tenantsInfo?.[0]?.displayName}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalPhoneIcon />
                  <Typography variant="body1">SĐT liên hệ:</Typography>
                  <Typography variant="body2">{room?.tenantsInfo?.[0]?.phone}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMonthIcon />
                  <Typography variant="body1">Ngày sinh:</Typography>
                  <Typography variant="body2">{room?.tenantsInfo?.[0]?.dateOfBirth}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon />
                  <Typography variant="body1">Địa chỉ:</Typography>
                  <Typography variant="body2">{room?.tenantsInfo?.[0]?.address}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContactMailIcon />
                  <Typography variant="body1">Email:</Typography>
                  <Typography variant="body2">{room?.tenantsInfo?.[0]?.email}</Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Hóa đơn chưa thanh toán */}
          <Box px={2} py={2} sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
            height: '40%',
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            overflowY: 'auto'
          }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              💰 Hóa đơn chưa thanh toán
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 1
            }}>
              {billNew?.length === 0 &&
                  <Typography
                    sx={{
                      color: 'green',
                      fontWeight: 'bold',
                      px: 3,
                      py: 1.5,
                      textAlign: 'center',
                      width:500
                    }}
                  >
                    ✅ Bạn đã thanh toán đầy đủ
                  </Typography>
              }
              {billNew?.map((bill, index) => (
                <Box key={index}
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '12px',
                    px: 2,
                    py: 1,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#fff'),
                    boxShadow: 1,
                    cursor: (room?.memberIds?.includes(user._id) && 'pointer')
                  }}
                  onClick={() => handleToBill(bill.hostelInfo._id, bill._id)}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    Tháng: {bill?.utilityInfo?.month}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Phí thanh toán: {bill?.totalAmount}₫
                  </Typography>
                  <Typography variant="caption" color="error">
                    Trạng thái: {bill.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Cột bên phải */}
        <Box sx={{
          width: '50%',
          p: '0px 0px 0px 23px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '20px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white')
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consumptionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dien" name="Điện (kWh)" stroke="#f39c12" strokeWidth={3} />
              <Line type="monotone" dataKey="nuoc" name="Nước (m³)" stroke="#3498db" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Container>
  )
}

export default InforRoom
