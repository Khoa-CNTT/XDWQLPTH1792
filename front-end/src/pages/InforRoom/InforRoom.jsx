import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BedsitBar from '../Home/BedsitBar/BedsitBar'
import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import PersonIcon from '@mui/icons-material/Person'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'

import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import theme from '~/theme'

// Rechart
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const itemData = [
  {
    img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Breakfast',
  },
  {
    img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Burger',
  },
  {
    img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Camera',
  },
  {
    img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    title: 'Coffee',
  },
  {
    img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Hats',
  },
  {
    img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Honey',
  },
  {
    img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    title: 'Basketball',
  },
  {
    img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Fern',
  },
  {
    img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Mushrooms',
  },
  {
    img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    title: 'Tomato basil',
  },
  {
    img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
    title: 'Sea star',
  }
];

const data = [
  { name: 'Tháng 1', doanhThu: 4000 },
  { name: 'Tháng 2', doanhThu: 3000 },
  { name: 'Tháng 3', doanhThu: 5000 },
  { name: 'Tháng 4', doanhThu: 7000 },
  { name: 'Tháng 5', doanhThu: 2000 },
];
function InforRoom() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BedsitBar />
      <Box p={3} sx={{
        display: 'flex',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5'),
        height: (theme) => theme.trello.boardContentHeight
      }}>
        <Box sx={{
          width: '60%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {/** Hàng bên trái thứ 1 */}
          <Box px={2} sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
            height: '60%',
            borderRadius: '20px'
          }}>
            <Box my={2} sx={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Typography variant="h5" sx={{
                fontWeight: '600'
              }} > Căn phòng</Typography>
            </Box>
            <Box sx={{ display: 'flex' }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '50%'
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon />
                  <Typography variant="span" > Số phòng:</Typography>
                  <Typography variant="span" > 101</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon />
                  <Typography variant="span" > Diện tích:</Typography>
                  <Typography variant="span" > 11 x 12 </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <AttachMoneyIcon />
                  <Typography variant="span" > Giá thuê:</Typography>
                  <Typography variant="span" > 2000000 đồng </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon />
                  <Typography variant="span" > Tiện ích:</Typography>
                  <Typography variant="span" > Điều hòa, máy lạnh, wifi miễn phí </Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon />
                  <Typography variant="span" > Tình trạng:</Typography>
                  <Typography variant="span" > Đã thuê</Typography>
                </Box>
              </Box>
              <Box sx={{
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
              }}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <PersonIcon />
                  <Typography variant="span" > Người sở hữu:</Typography>
                  <Typography variant="span" > Nguyễn Văn Gia Huy</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <LocalPhoneIcon />
                  <Typography variant="span" > Số điện thoại liên hệ:</Typography>
                  <Typography variant="span" > 0909009009</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CalendarMonthIcon />
                  <Typography variant="span" > Ngày bắt đầu thuê:</Typography>
                  <Typography variant="span" > 20-12-2023</Typography>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CalendarMonthIcon />
                  <Typography variant="span" > Ngày hết hạn hợp đồng:</Typography>
                  <Typography variant="span" > 20-12-2024</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          {/** Hàng bên trái thứ 2 */}
          <Box px={2} sx={{
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : 'white'),
            height: '40%',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
          }}>
            <ResponsiveContainer width="100%" height='100%'>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  strokeWidth='4' // độ dày của line
                  tick={{
                    fontSize: '14px'
                  }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="doanhThu" stroke="#8884d8" strokeWidth={4} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>
        {/** Cột hình ảnh */}
        <Box sx={{
          width: '40%',
          p: '0px 0px 0px 23px'
        }}>
          <ImageList sx={{ width: '100%', height: '100%', borderRadius: '10px' }} cols={3} rowHeight={164}>
            {itemData.map((item) => (
              <ImageListItem key={item.img}>
                <img
                  srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                  style={{
                    borderRadius: '8px'
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </Box>
    </Container>
  )
}
export default InforRoom