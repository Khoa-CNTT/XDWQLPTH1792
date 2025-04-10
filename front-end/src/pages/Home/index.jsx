import React from 'react'
import AppBar from '~/components/AppBar'
import { Box } from '@mui/material'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

const categories = ['Apartment', 'House', 'Land', 'Commercial']
import Divider from '@mui/material/Divider'
const mockHostels = [
  { id: 1, name: 'Nhà trọ A', location: 'Hà Nội', price: '2 triệu/tháng' },
  { id: 2, name: 'Nhà trọ B', location: 'Hồ Chí Minh', price: '3 triệu/tháng' },
  { id: 3, name: 'Nhà trọ C', location: 'Đà Nẵng', price: '1.5 triệu/tháng' },
  { id: 4, name: 'Nhà trọ D', location: 'Hải Phòng', price: '2.5 triệu/tháng' },
];
function HouesPage() {
  const [tabValue, setTabValue] = React.useState(0)
  return (
    <>
      <AppBar />
      <Box
        sx={{
          backgroundImage: 'url("src/assets/Home/Home1.png")',
          backgroundAttachment: 'fixed', // Giữ ảnh cố định khi cuộn
          imageRendering: 'auto', // Cải thiện chất lượng hiển thị
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth='md' sx={{ background: 'rgba(255, 255, 255, 0.9)', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography color='black' variant='h4' fontWeight='bold' gutterBottom>
            Bạn muốn tìm một nhà trọ rẻ và tốt?
          </Typography>
          <Typography variant='subtitle1' color='rgba(48, 42, 42, 0.9)' gutterBottom>
            Chúng tôi cung cấp các nhà trọ tốt nhất với giá cả phải chăng và dịch vụ tuyệt vời.
          </Typography>

          <Box display='flex' alignItems='center' gap={1}>
            <Typography color='black' variant='body1'>✔ Chúng tôi có danh sách các nhà trọ đánh giá tốt</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap={1}>
            <Typography color='black' variant='body1'>✔ Bạn có thể đăt cọc để được nhận trọ </Typography>
          </Box>
          <Box display='flex' alignItems='center' gap={1}>
            <Typography color='black' variant='body1'>✔ Hỗ trợ quản lý nhà trọ tiện ích</Typography>
          </Box>

          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mt: 3 }}>
            <Tab label='To Rent' />
          </Tabs>

          <Box display='flex' gap={2} mt={2}>
            <TextField fullWidth label='Bạn muốn tìm kiếm trọ giá bao nhiêu ?' variant='outlined' />
            <TextField fullWidth label='Địa điểm' variant='outlined' />
            {/* <TextField select fullWidth label='Category' variant='outlined'>
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField> */}
            <Button variant='contained' sx={{
              bgcolor: 'rgb(71, 60, 139)',
              '&:hover': {
                bgcolor: 'rgb(64, 52, 142)'
              }

            }} size='large'>Search</Button>
          </Box>
        </Container>
      </Box>
      {/* Danh sách nhà trọ */}
      <Box sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5'), }}>
        <Container
          sx={{
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          maxWidth='lg'
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom align='center'>
            DANH SÁCH NHÀ TRỌ
          </Typography>
          <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '#473C8B') }} variant='h6'>{'Đà Nẵng'}</Typography>
          <Divider sx={{
            height: '2px'
          }} />
          <Grid container spacing={3}>
            {mockHostels.map((hostel) => (
              <Grid item xs={12} sm={6} md={4} key={hostel.id}>
                <Card
                  sx={{
                    maxWidth: 345,
                    boxShadow: 3,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-1/449932819_1957019394816619_8636880080737780620_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=103&ccb=1-7&_nc_sid=e99d92&_nc_ohc=NrugBwI4ofQQ7kNvwHf0Tu3&_nc_oc=Adk-qDU81U4fxaEIBdhzSKi691DRbw665bX5G2nYqXy6t8Zct608WWrFvdrs3_MMSwY&_nc_zt=24&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=aeAKhQNr7ECywbPE4kaeew&oh=00_AfGhJCPmS3CPxt-plcyuK2BLUTRUi9g_ak2LEaM6mHKd4g&oe=67F7EAD0" // Thay bằng URL ảnh thực tế
                    alt={hostel.name}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {hostel.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Địa điểm: {hostel.location}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Giá: {hostel.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Xem chi tiết
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default HouesPage