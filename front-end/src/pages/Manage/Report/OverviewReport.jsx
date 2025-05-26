import { useState, useEffect } from 'react'
import { Card, CardContent } from '@mui/material'
import { Grid, Typography, Box, MenuItem, FormControl, Select, InputLabel, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import { PeopleAlt, HomeWork, AttachMoney } from '@mui/icons-material'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { fetchHostelsByOwnerIdAPI, getListPaymentsAPI } from '~/apis'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card
      sx={{
        borderRadius: 5,
        p: 2,
        backdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box bgcolor={color} p={1.5} borderRadius={3} color="white">
            <Icon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" fontSize={14}>
              {label}
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function OverviewReport() {
  const [hostels, setHostels] = useState(null)
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [selectedHostel, setSelectedHostel] = useState('all')
  const [listDataPayments, setLishDataPayment] = useState([])
  const handlePropertyChange = (event) => {
    setSelectedHostel(event.target.value)
  }

  useEffect(() => {
    fetchHostelsByOwnerIdAPI().then((res) => {
      setHostels(res)
    })
  }, [])
  let hostelOptions = null
  let sumRoom = null
  let sumTenants = null
  let sumTotal = null
  let sumTotalLastMonth = null
  if (hostels) {
    hostelOptions = [{ _id: 'all', hostelName: 'Tất cả nhà trọ' }, ...hostels]
  }
  const hostelIds = hostels?.map(hostel => hostel._id)
  useEffect(() => {
    if (hostelIds?.length > 0) {
      getListPaymentsAPI({ hostelIds }).then((res) => {
        setLishDataPayment(res)
      })
    }
  }, [hostelIds])
  if (selectedHostel === 'all') {
    sumRoom = hostels?.reduce((sum, hostel) => sum + (hostel.rooms?.length || 0), 0)
    sumTenants = hostels?.reduce((sum, hostel) => sum + (hostel.tenantIds?.length || 0), 0)
    sumTotal = listDataPayments?.filter(payment => payment?.utility?.month === selectedDate.format('MM/YYYY'))?.reduce((total, payment) => total + (payment.amount || 0), 0)
    sumTotalLastMonth = listDataPayments?.filter(payment => payment?.utility?.month === selectedDate.subtract(1, 'month').format('MM/YYYY'))?.reduce((total, payment) => total + (payment.amount || 0), 0)
  } else {
    const hostel = hostels?.find(hostel => hostel._id === selectedHostel)
    sumRoom = hostel?.rooms.length || 0
    sumTenants = hostel?.tenantIds.length || 0
    sumTotal = listDataPayments?.filter(payment => payment?.utility?.month === selectedDate.format('MM/YYYY') && payment?.bill?.hostelId === hostel._id)?.reduce((total, payment) => total + (payment.amount || 0), 0)
    sumTotalLastMonth = listDataPayments?.filter(payment => payment?.utility?.month === selectedDate.subtract(1, 'month').format('MM/YYYY') && payment?.bill?.hostelId === hostel._id)?.reduce((total, payment) => total + (payment.amount || 0), 0)
  }

  const getMonthlyRevenueByYear = (data, selectedYear, hostelId) => {
    const monthlyRevenueMap = {}
    if (hostelId !== 'all') {
      data = data.filter(payment => payment?.utility?.hostelId === hostelId)
    }
    data.forEach(item => {
      const monthYear = item?.utility?.month // dạng "5/2025"
      const amount = item.amount || 0

      if (monthYear) {
        const [month, year] = monthYear.split('/')
        if (year === selectedYear) {
          const key = `${parseInt(month)}/${year}`
          if (!monthlyRevenueMap[key]) {
            monthlyRevenueMap[key] = 0
          }
          monthlyRevenueMap[key] += amount
        }
      }
    })
    // Tạo mảng đầy đủ 12 tháng
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
      const monthStr = `${i + 1}/${selectedYear}`
      return {
        month: monthStr,
        revenue: monthlyRevenueMap[monthStr] || 0
      }
    })

    return monthlyRevenue
  }
  const selectedYear = selectedDate.format('MM/YYYY')?.split('/')[1]
  return (
    <Box
      p={{ xs: 2, md: 4 }}
      sx={{
        background: (theme) => (theme.palette.mode === 'dark' ? 'linear-gradient(to right,rgb(87, 99, 100),rgb(33, 33, 40))' : 'linear-gradient(to right, #e0f7fa, #ffffff)'),
        borderRadius: 5
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={800} color={(theme) => (theme.palette.mode === 'dark' ? 'white' : 'black')} >
          📊 Tổng Quan Hoạt Động
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          {/* Chọn nhà trọ */}
          <FormControl sx={{ minWidth: 240 }} size="medium" variant="outlined">
            <InputLabel id="select-hostel-label" sx={{ fontWeight: 600 }}>
              Nhà trọ
            </InputLabel>
            <Select
              labelId="select-hostel-label"
              value={selectedHostel}
              label="Nhà trọ"
              onChange={handlePropertyChange}
              sx={{
                borderRadius: 2,
                boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
                '& .MuiSelect-select': { py: 1.5, px: 2, fontWeight: 600 }
              }}
            >
              {hostelOptions?.map((prop) => (
                <MenuItem key={prop._id} value={prop._id}>
                  {prop?.hostelName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Chọn tháng và năm */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month']}
              label="Tháng & Năm"
              minDate={dayjs('2020-01-01')}
              maxDate={dayjs()}
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              format="MM/YYYY"
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="medium"
                  sx={{
                    bgcolor: '#fff',
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
                    minWidth: 180,
                    '& .MuiInputBase-input': { py: 1.5, px: 2, fontWeight: 600 }
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Stack>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <StatCard icon={HomeWork} label="Tổng số phòng" value={sumRoom} color="#1976d2" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard icon={PeopleAlt} label="Khách đang thuê" value={sumTenants} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard icon={AttachMoney} label="Doanh thu tháng" value={sumTotal} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard icon={sumTotal >= sumTotalLastMonth ? TrendingUpIcon : TrendingDownIcon}
            label={sumTotal >= sumTotalLastMonth ? 'Tăng trưởng' : 'Giảm'}
            value={sumTotal >= sumTotalLastMonth ?
              `Tăng ${(sumTotal / (sumTotalLastMonth || 1) * 100 - 100).toFixed(2)}% so với tháng trước`
              : `Giảm ${(100 - (sumTotal / sumTotalLastMonth * 100)).toFixed(2)}% so với tháng trước`}
            color="#9c27b0" />
        </Grid>
      </Grid>

      <Box mt={5}>
        <Card
          sx={{
            borderRadius: 5,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            p: 3,
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={700}>
            📈 Doanh thu theo tháng
          </Typography>
          <ResponsiveContainer width="100%" height={320} >
            <LineChart
              data={getMonthlyRevenueByYear(listDataPayments, selectedYear, selectedHostel)}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1976d2" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#1976d2" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, 5000000]} // Giới hạn tối đa là 7 triệu
                width={80} // đảm bảo đủ chỗ cho số lớn như "10000000"
                tick={{ fontSize: 16 }} // nhỏ gọn hơn
              />
              <Tooltip formatter={(v) => `${v} triệu`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#colorRevenue)"
                strokeWidth={4}
                dot={{ r: 6, fill: '#1976d2' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </Box>
    </Box>
  )
}
export default OverviewReport