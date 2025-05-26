import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material'
import { useSelector } from 'react-redux'
import { fetchHostelsByOwnerIdAPI, getListPaymentsAPI } from '~/apis'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import TextField from '@mui/material/TextField'
function RevenueReportPage() {
  const [hostels, setHostels] = useState(null)
  const [selectedHostel, setSelectedHostel] = useState('all')
  const [selectedRoomId, setSelectedRoomId] = useState('')
  const [selectedYear, setSelectedYear] = useState(dayjs())
  const [roomList, setRoomList] = useState([])
  const [listDataPayments, setLishDataPayment] = useState([])
  useEffect(() => {
    fetchHostelsByOwnerIdAPI().then((res) => {
      setHostels(res)
    })
  }, [])
  const hostelIds = hostels?.map(hostel => hostel._id)
  useEffect(() => {
    if (hostelIds?.length > 0) {
      getListPaymentsAPI({ hostelIds }).then((res) => {
        setLishDataPayment(res)
      })
    }
  }, [hostels])
  useEffect(() => {
    if (selectedHostel !== 'all') {
      const hostel = hostels?.find(h => h._id === selectedHostel)
      setRoomList(hostel?.rooms || [])
    } else {
      setRoomList([])
    }
  }, [selectedHostel, hostels])

  const getMonthlyRevenueByYear = (data, selectedYear, hostelId, roomId = '') => {
    const monthlyRevenueMap = {}
    let filteredData = data

    if (hostelId !== 'all') {
      filteredData = filteredData.filter(payment => payment?.utility?.hostelId === hostelId)
    }
    if (roomId) {
      filteredData = filteredData.filter(payment => payment?.bill?.roomId === roomId)
    }

    filteredData.forEach(item => {
      const monthYear = item?.utility?.month
      const amount = item.amount || 0
      if (monthYear) {
        const [month, year] = monthYear.split('/')
        if (year === selectedYear.format('YYYY')) {
          const key = `${parseInt(month)}/${year}`
          if (!monthlyRevenueMap[key]) monthlyRevenueMap[key] = 0
          monthlyRevenueMap[key] += amount
        }
      }
    })

    return Array.from({ length: 12 }, (_, i) => {
      const monthStr = `${i + 1}/${selectedYear.format('YYYY')}`
      return {
        month: monthStr,
        revenue: monthlyRevenueMap[monthStr] || 0
      }
    })
  }

  let hostelOptions = null
  // let sumRoom = null
  // let sumTenants = null
  // let sumTotal = null
  // let sumTotalLastMonth = null
  if (hostels) {
    hostelOptions = [{ _id: 'all', hostelName: 'Tất cả nhà trọ' }, ...hostels]
  }
  const monthlyData = getMonthlyRevenueByYear(listDataPayments, selectedYear, selectedHostel, selectedRoomId)
  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        📊 Báo cáo doanh thu theo năm
      </Typography>

      <Stack direction="row" spacing={2} mb={4}>
        {/* Chọn tháng và năm */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year']}
            label="Tháng & Năm"
            minDate={dayjs('2020-01-01')}
            maxDate={dayjs()}
            value={selectedYear}
            onChange={(newValue) => setSelectedYear(newValue)}
            format="YYYY"
            renderInput={(params) => (
              <TextField
                {...params}
                size="medium"
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
                  minWidth: 180,
                  '& .MuiInputBase-input': { py: 1.5, px: 2, fontWeight: 600 },
                }}
              />
            )}
          />
        </LocalizationProvider>

        {/* Chọn nhà trọ */}
        <FormControl sx={{ minWidth: 240 }} size="medium" variant="outlined">
          <InputLabel id="select-hostel-label" sx={{ fontWeight: 600 }}>
            Nhà trọ
          </InputLabel>
          <Select
            labelId="select-hostel-label"
            value={selectedHostel}
            label="Nhà trọ"
            onChange={(e) => setSelectedHostel(e.target.value)}
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

        <FormControl sx={{ minWidth: 220 }} disabled={selectedHostel === 'all'}>
          <InputLabel>Chọn phòng</InputLabel>
          <Select value={selectedRoomId} label="Chọn phòng" onChange={e => setSelectedRoomId(e.target.value)} sx={{
            borderRadius: 2,
            boxShadow: '0 2px 8px rgb(0 0 0 / 0.1)',
            '& .MuiSelect-select': { py: 1.5, px: 2, fontWeight: 600 }
          }}>
            <MenuItem value="">Tất cả phòng</MenuItem>
            {roomList.map(r => (
              <MenuItem key={r._id} value={r._id}>{r.roomName}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <Card sx={{ p: 3, borderRadius: 4, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          📋 Báo cáo doanh thu chi tiết
        </Typography>
        <Box sx={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                <th style={{ padding: 12, border: '1px solid #ddd' }}>Tháng</th>
                <th style={{ padding: 12, border: '1px solid #ddd' }}>Doanh thu</th>
                <th style={{ padding: 12, border: '1px solid #ddd' }}>% So với tháng trước</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((item, idx, arr) => {
                const prev = arr[idx - 1]?.revenue || 0
                const current = item.revenue
                const diff = prev ? (((current - prev) / prev) * 100).toFixed(2) : '—'
                return (
                  <tr key={item.month}>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>{item.month}</td>
                    <td style={{ padding: 12, border: '1px solid #ddd' }}>{current.toLocaleString()} đ</td>
                    <td style={{ padding: 12, border: '1px solid #ddd', color: current >= prev ? 'green' : 'red' }}>
                      {prev === 0 ? '—' : `${diff}%`}
                    </td>
                  </tr>
                )
              })}
              <tr style={{ fontWeight: 'bold', background: '#fafafa' }}>
                <td style={{ padding: 12, border: '1px solid #ddd' }}>Tổng doanh thu năm</td>
                <td colSpan={2} style={{ padding: 12, border: '1px solid #ddd' }}>
                  {monthlyData.reduce((acc, cur) => acc + cur.revenue, 0).toLocaleString()} đ
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Card>
    </Box>
  )
}

export default RevenueReportPage
