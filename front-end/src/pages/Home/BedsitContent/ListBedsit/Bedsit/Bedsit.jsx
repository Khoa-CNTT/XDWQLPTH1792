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
function Bedsit() {
  return (
    <Box sx={{
      cursor: 'pointer'
    }}>
      <Link to='/infor-room'>
        <Card sx={{
          maxWidth: 350,
          bgcolor: 'white',
          borderRadius: '0px',
          boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
        }}>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="194"
              image={Test}
              alt="Paella dish"
              sx={{
                objectFit: 'cover'// cắt ảnh vửa khít với kích thước
              }}
            >

            </CardMedia>
            <Badge
              badgeContent={5}
              color="secondary"
              sx={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                '& .MuiBadge-badge': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)', // Chỉnh viền ngoài
                }
              }}
            >
              <IconButton sx={{ boxShadow: 2 }}>
                <CameraAltIcon sx={{
                  '&:hover': {
                    color: '#CCCCCC'
                  }
                }} />
              </IconButton>
            </Badge>
          </Box>
          <CardContent>
            <Typography sx={{
              fontWeight: 700,
              color: '#EE7942'
            }}>
              2.0000.000 đồng
            </Typography>
            <Typography variant='span' sx={{
              fontWeight: 500,
              fontSize: '1.4rem',
              color: 'black'
            }}>
              Phòng số 24
            </Typography>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <AspectRatioIcon sx={{
                fontSize: '18px',
                color: 'rgba(0, 0, 0, 0.6)'
              }} />
              <Typography sx={{
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'rgba(0, 0, 0, 0.6)'
              }}>
                L: 10m W:4m
              </Typography>
            </Box>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <BoyIcon sx={{
                fontSize: '25px',
                color: 'rgba(0, 0, 0, 0.6)',
                mx: -0.4
              }} />
              <Typography sx={{
                fontWeight: 600,
                fontSize: '1.4rem',
                color: 'rgba(0, 0, 0, 0.6)'
              }}>
                2
              </Typography>
            </Box>
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.4rem',
              color: 'rgba(0, 0, 0, 0.6)'
            }}>
              Tiện ích: Điều hòa, máy nước nóng,...
            </Typography>
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.4rem',
              color: 'black'
            }}>
              Tình trạng: Trống
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Box>
  )
}
export default Bedsit