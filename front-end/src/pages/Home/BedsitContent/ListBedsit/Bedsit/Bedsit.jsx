import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Test from '~/assets/Test.jpg'
import { Badge, IconButton } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BoyIcon from '@mui/icons-material/Boy'
import AspectRatioIcon from '@mui/icons-material/AspectRatio'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { STATUS_ROOM } from '~/utils/constants'
function Bedsit({ room }) {
  return (
    <Box sx={{
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: 6
      },
    }}>
      <Link to={`/infor-room/${room._id}`}>
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          sx={{
            width: 300,
            height: 450,
            bgcolor: 'white',
            borderRadius: '10px',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)'
          }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="194"
              image={room?.images}
              alt="Paella dish"
              sx={{
                objectFit: 'cover'// cắt ảnh vửa khít với kích thước
              }}
            >
            </CardMedia>
          
          </Box>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Giá phòng */}
            <Typography sx={{
              fontWeight: 700,
              color: '#EE7942',
              fontSize: '1.6rem'
            }}>
              {room?.price?.toLocaleString()} đồng
            </Typography>

            {/* Tên phòng */}
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.5rem',
              color: '#333'
            }}>
              {room?.roomName}
            </Typography>

            {/* Kích thước phòng */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AspectRatioIcon sx={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.6)' }} />
              <Typography sx={{
                fontWeight: 500,
                fontSize: '1.4rem',
                color: 'rgba(0, 0, 0, 0.6)'
              }}>
                Diện tích: {room?.length}m x {room?.width}m
              </Typography>
            </Box>

            {/* Sức chứa */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoyIcon sx={{ fontSize: 22, color: 'rgba(0, 0, 0, 0.6)' }} />
              <Typography sx={{
                fontWeight: 500,
                fontSize: '1.4rem',
                color: 'rgba(0, 0, 0, 0.6)'
              }}>
                Số người trong phòng : {room.memberIds?.length || 'Không có'} người
              </Typography>
            </Box>

            {/* Tiện ích */}
            <Typography sx={{
              fontWeight: 500,
              fontSize: '1.4rem',
              color: 'rgba(0, 0, 0, 0.7)'
            }}>
              Tiện ích: {room?.utilities.join(', ') || 'Không có thông tin'}
            </Typography>

            {/* Tình trạng */}
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.4rem',
              color: room?.status === STATUS_ROOM.AVAILABLE ? 'green' : 'red'
            }}>
              Tình trạng: {room?.status}
            </Typography>
          </CardContent>

        </Card>
      </Link>
    </Box>
  )
}
export default Bedsit