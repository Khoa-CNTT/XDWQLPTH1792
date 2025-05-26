import AppBar from '~/components/AppBar'
import { Box } from '@mui/material'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import MenuItem from '@mui/material/MenuItem'
import { getAllHostelPublic, findHostelsAPI } from '~/apis'
import Divider from '@mui/material/Divider'
import { useState, useEffect } from 'react'

import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import {
  POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import { districtsInDaNang, STATUS_ROOM } from '~/utils/constants'
import ModalHostel from '~/components/Modal/ModalHostel'
import { motion } from 'framer-motion'
function HouesPage() {
  const [tabValue, setTabValue] = useState(0)
  const [hostels, setHostels] = useState(null)

  const [open, setOpen] = useState(false)
  const [selectedHostel, setSelectedHostel] = useState(null) // Lưu thông tin nhà trọ được chọn
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [wards, setWards] = useState([])
  const [selectedWard, setSelectedWard] = useState('')

  const listData = (data) =>
    data?.map((hostel) => ({
      price: hostel?.minPrice !== hostel.maxPrice ? `${hostel.minPrice || 0}-${hostel.maxPrice || 0} đồng/tháng` : `${hostel.minPrice || 0} đồng/ tháng`,
      ...hostel
    }))
  useEffect(() => {
    getAllHostelPublic().then((res) => {
      const mockHostels = listData(res)
      setHostels(mockHostels)
    })
  }, [])

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  const searchHostel = async (data) => {
    data.price = Number(data.price)
    const result = await findHostelsAPI(data)
    const mockHostels = listData(result)
    setHostels(mockHostels)
  }
  return (
    <>
      <AppBar />
      <Box sx={{ bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5') }}>
        <Box
          sx={{
            backgroundImage: 'url("src/assets/Home/Home1.png")',
            backgroundAttachment: 'fixed', // Giữ ảnh cố định khi cuộn
            imageRendering: 'auto', // Cải thiện chất lượng hiển thị
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Container maxWidth='md'
            component={motion.div}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            sx={{ background: 'rgba(255, 255, 255, 0.9)', p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography color='black' variant='h4' fontWeight='bold' gutterBottom>
              Bạn muốn tìm một nhà trọ rẻ và tốt ở Đà Nẵng?
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
              <Tab label='Tìm kiếm' />
            </Tabs>

            <form onSubmit={handleSubmit(searchHostel)}>
              <Box display='flex' gap={2} mt={2}>
                <Box flex={2}>
                  <TextField
                    InputLabelProps={{
                      style: { color: '#333' } // Màu chữ cố định cho label
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: '#333' // Màu chữ cố định cho label
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1976d2' // Màu chữ khi focus
                      },
                      '& .MuiInputBase-input': {
                        color: '#333' // Màu chữ cố định cho nội dung nhập
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333' // Màu viền cố định
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555' // Màu viền khi hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2' // Màu viền khi focus
                      },
                    }}
                    fullWidth
                    label='Bạn muốn tìm kiếm trọ giá bao nhiêu ?'
                    variant='outlined'
                    {...register('price', {
                      pattern: {
                        value: POSITIVE_NUMBER_RULE,
                        message: POSITIVE_NUMBER_RULE_MESSAGE
                      }
                    })}
                    error={!!errors['price']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'price'} />
                </Box>
                <Box flex={1}>
                  <TextField
                    select
                    fullWidth
                    label='Chọn quận'
                    variant='outlined'
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left'
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left'
                        },
                        getContentAnchorEl: null,
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflowY: 'auto',
                            zIndex: 1300 // đảm bảo nằm trên các component khác
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: '#333' // Màu chữ cố định cho label
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1976d2' // Màu chữ khi focus
                      },
                      '& .MuiInputBase-input': {
                        color: '#333' // Màu chữ cố định cho nội dung nhập
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333' // Màu viền cố định
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555' // Màu viền khi hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2' // Màu viền khi focus
                      }
                    }}
                    {...register('address', {
                      onChange: (e) => {
                        const districtName = e.target.value
                        setSelectedDistrict(`${e.target.value}, Đà Nẵng`)
                        const district = districtsInDaNang.find(d => d.name === districtName)
                        setWards(district ? district?.wards : [])
                      }
                    })}
                  >
                    {districtsInDaNang?.map((address) => (
                      <MenuItem key={address.name} value={address.name}>
                        {address.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Box flex={1}>
                  <TextField
                    select
                    fullWidth
                    label='Chọn phường'
                    variant='outlined'
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left'
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left'
                        },
                        getContentAnchorEl: null,
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            overflowY: 'auto',
                            zIndex: 1300 // đảm bảo nằm trên các component khác
                          }
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': {
                        color: '#333' // Màu chữ cố định cho label
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1976d2' // Màu chữ khi focus
                      },
                      '& .MuiInputBase-input': {
                        color: '#333' // Màu chữ cố định cho nội dung nhập
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333' // Màu viền cố định
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#555' // Màu viền khi hover
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2' // Màu viền khi focus
                      }
                    }}
                    value={selectedWard}
                    onChange={(e) => {
                      const wardName = e.target.value
                      setSelectedWard(wardName)
                      const fullAddress = `${wardName}, ${selectedDistrict}`
                      setValue('address', fullAddress) // ✅ Ghi địa chỉ đầy đủ vào field `address`
                    }}
                  >
                    {wards?.map((ward) => (
                      <MenuItem key={ward} value={ward}>
                        {ward}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                <Button variant='contained'
                  className='interceptor-loading'
                  sx={{
                    bgcolor: 'rgb(71, 60, 139)',
                    '&:hover': {
                      bgcolor: 'rgb(64, 52, 142)'
                    },
                    color: 'white'
                  }} type='submit' size='large'>Tìm kiếm</Button>
              </Box>
            </form>
          </Container>
        </Box>
        {/* Danh sách nhà trọ */}
        <Box>
          <Container
            sx={{
              mt: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
            maxWidth='lg'
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom align='center'>
              DANH SÁCH NHÀ TRỌ ĐÀ NẴNG
            </Typography>
            {/* <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '#473C8B') }} variant='h6'>{'Đà Nẵng'}</Typography> */}
            <Divider sx={{
              height: '2px'
            }} />
            <Grid container spacing={3}>
              {hostels?.map((hostel) => (
                <Grid item xs={12} sm={6} md={4} key={hostel._id}>
                  <Card
                    sx={{
                      maxWidth: 345,
                      boxShadow: 3,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={hostel?.images} // Thay bằng URL ảnh thực tế
                      alt={hostel.hostelName}
                    />
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {hostel.hostelName}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Địa điểm: {hostel.address}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Giá: {hostel.price || 0}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Số phòng trống: {hostel.rooms.filter(room => room.status === STATUS_ROOM.AVAILABLE).length}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button className='interceptor-loading' size="small" color="primary" onClick={() => {
                        setOpen(true)
                        setSelectedHostel(hostel)
                      }}>
                        Xem chi tiết
                      </Button>
                    </CardActions>
                    <ModalHostel open={open} handleClose={() => setOpen(false)} hostel={selectedHostel} />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  )
}

export default HouesPage