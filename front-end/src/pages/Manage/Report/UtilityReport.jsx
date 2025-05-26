import { useState, useEffect } from 'react'
import { Card, CardContent, Typography, Box, MenuItem, FormControl, Select, InputLabel, Grid, Stack } from '@mui/material'
import TextField from '@mui/material/TextField'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { getListPaymentsAPI, fetchHostelsByOwnerIdAPI } from '~/apis'

function UtilityReport() {
  const [hostels, setHostels] = useState([])
  const [selectedHostel, setSelectedHostel] = useState('all')
  const [selectedRoomId, setSelectedRoomId] = useState('all')
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [listPayments, setListPayments] = useState([])

  useEffect(() => {
    fetchHostelsByOwnerIdAPI().then(res => setHostels(res))
  }, [])

  const hostelOptions = [{ _id: 'all', hostelName: 'Tất cả nhà trọ' }, ...hostels]
  const selectedYear = selectedDate.format('YYYY')

  useEffect(() => {
    const hostelIds = selectedHostel === 'all' ? hostels.map(h => h._id) : [selectedHostel]
    if (hostelIds.length > 0) {
      getListPaymentsAPI({ hostelIds }).then(setListPayments)
    }
  }, [selectedHostel, hostels])

  const filteredPayments = listPayments.filter(payment => {
    const [month, year] = (payment?.utility?.month || '').split('/')
    if (!year || year !== selectedYear) return false
    if (selectedHostel !== 'all' && payment?.bill?.hostelId !== selectedHostel) return false
    if (selectedRoomId !== 'all' && payment?.bill?.roomId !== selectedRoomId) return false
    return true
  })

  const dataByMonth = Array.from({ length: 12 }, (_, i) => {
    const monthKey = `${String(i + 1).padStart(2, '0')}/${selectedYear}`
    const monthlyData = filteredPayments.filter(p => p?.utility?.month === monthKey)
    const totalElectric = monthlyData.reduce((sum, p) => sum + ((p?.utility?.electricEnd - p?.utility?.electricStart) || 0), 0)
    const totalWater = monthlyData.reduce((sum, p) => sum + ((p?.utility?.waterEnd - p?.utility?.waterStart) || 0), 0)
    console.log('data', { month: monthKey, electric: totalElectric, water: totalWater })
    return { month: monthKey, electric: totalElectric, water: totalWater }
  })

  const roomOptions = selectedHostel === 'all'
    ? []
    : [{ _id: 'all', roomName: 'Tất cả phòng' }, ...hostels.find(h => h._id === selectedHostel)?.rooms || []]

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={700} mb={3}>🔌 Báo cáo Điện - Nước</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} mb={4}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Nhà trọ</InputLabel>
          <Select value={selectedHostel} onChange={e => setSelectedHostel(e.target.value)} label="Nhà trọ">
            {hostelOptions.map(h => (
              <MenuItem key={h._id} value={h._id}>{h.hostelName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }} disabled={selectedHostel === 'all'}>
          <InputLabel>Phòng</InputLabel>
          <Select value={selectedRoomId} onChange={e => setSelectedRoomId(e.target.value)} label="Phòng">
            {roomOptions.map(r => (
              <MenuItem key={r._id} value={r._id}>{r.roomName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={['year']}
            label="Năm"
            value={selectedDate}
            onChange={newValue => setSelectedDate(newValue)}
          />
        </LocalizationProvider>
      </Stack>

      <Card sx={{ borderRadius: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>📈 Tiêu thụ Điện - Nước theo tháng ({selectedYear})</Typography>
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={dataByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => `${v} kWh / m³`} />
            <Line type="monotone" dataKey="electric" stroke="#f44336" strokeWidth={3} name="Điện (kWh)" />
            <Line type="monotone" dataKey="water" stroke="#2196f3" strokeWidth={3} name="Nước (m³)" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </Box>
  )
}

export default UtilityReport