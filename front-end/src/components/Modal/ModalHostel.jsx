import {
  Box,
  Typography,
  Modal,
  Grid,
  IconButton,
  Chip,
  Button
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import WifiIcon from '@mui/icons-material/Wifi'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import BedIcon from '@mui/icons-material/Bed'
import ShowerIcon from '@mui/icons-material/Shower'
import MapIcon from '@mui/icons-material/Map'
import HeatPumpIcon from '@mui/icons-material/HeatPump'
import HotTubIcon from '@mui/icons-material/HotTub'
import MessageIcon from '@mui/icons-material/Message'
import { createNewConversationAPI, createNewMessaggeAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { socketIoInstance } from '~/socketClient'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 3,
  p: 3,
  maxHeight: '90vh',
  overflowY: 'auto'
}
const utilityIcons = {
  Wifi: <WifiIcon />,
  'Máy lạnh': <AcUnitIcon />,
  'Chỗ để xe': <LocalParkingIcon />,
  Giường: <BedIcon />,
  'Toilet riêng': <ShowerIcon />,
  'Tủ lạnh': <AcUnitIcon />, // Thay bằng icon phù hợp
  'Điều hòa': <HeatPumpIcon />,
  'Nước nóng': <HotTubIcon />
}
const getUniqueUtilities = (hostel) => {
  if (!hostel?.rooms) return [] // Kiểm tra nếu không có rooms

  // Gộp tất cả tiện ích từ các phòng
  const allUtilities = hostel.rooms.flatMap((room) => room.utilities || [])

  // Loại bỏ các tiện ích trùng lặp
  const uniqueUtilities = [...new Set(allUtilities)]

  return uniqueUtilities
}
const ModalHostel = ({ open, handleClose, hostel }) => {
  const navigate = useNavigate()
  const uniqueUtilities = getUniqueUtilities(hostel) // Lấy danh sách tiện ích duy nhất

  const createNewConversation = async (ownerID) => {
    const participants = [ownerID]
    const res = await createNewConversationAPI({ participants })
    const dataSent = {
      content: `Tôi muốn liên hệ tìm hiểu về ${hostel?.hostelName} `,
      conversationId: res._id
    }
    const result = await createNewMessaggeAPI(dataSent)
    socketIoInstance.emit('FE_USER_MESSAGE', result)
    navigate(`/home/message/${res._id}`)
  }
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'red' }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant='h5' fontWeight="bold" mb={2} c align="center">
          {hostel?.hostelName}
        </Typography>

        {/* Hình ảnh */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={12}>
            <img
              src={hostel?.images}
              alt='Phòng trọ'
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <img
              src='https://i.imgur.com/xCejSlY.jpg'
              alt='Phòng trọ'
              style={{ width: '100%', borderRadius: 8 }}
            />
          </Grid> */}
        </Grid>

        {/* Thông tin */}
        <Typography variant='body1' mb={1}>
          <strong>Địa chỉ:</strong> {hostel?.address}
        </Typography>
        <Typography variant='body1' mb={1}>
          <strong>Giá thuê:</strong> {hostel?.price}
        </Typography>
        <Typography variant='body1' mb={1}>
          <strong>Tiền điện:</strong> {hostel?.electricity_price} đồng/chữ
        </Typography>
        <Typography variant='body1' mb={1}>
          <strong>Tiền nước:</strong> {hostel?.water_price} đồng/số
        </Typography>
        <Typography variant='body1' mb={2}>
          <strong>Chủ trọ:</strong> {hostel?.ownerInfo[0]?.displayName}
        </Typography>
        <Typography variant='body1' mb={2}>
          <strong>SDT liên hệ:</strong> {hostel?.ownerInfo[0]?.phone}
        </Typography>

        {/* Tiện ích */}
        <Typography variant='subtitle1' mb={1}>
          Tiện ích:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {uniqueUtilities.map((utility, index) => (
            <Chip
              key={index}
              icon={utilityIcons[utility] || null} // Hiển thị icon nếu có
              label={utility}
            />
          ))}
        </Box>

        {/* Mô tả */}
        <Typography variant='body2' mb={2}>
          {hostel?.description}
        </Typography>

        {/* Bản đồ & Liên hệ */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              variant='outlined'
              startIcon={<MapIcon />}
              fullWidth
              href={`https://maps.google.com/place/${hostel?.address}`}
              target='_blank'
            >
              Xem bản đồ
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant='contained'
              startIcon={<MessageIcon />}
              fullWidth
              onClick={() => createNewConversation(hostel?.ownerInfo[0]?._id)}
            >
              Liên hệ nhắn tin
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ModalHostel