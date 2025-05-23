// import { useState, useMemo, useEffect } from 'react'
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   FormControl,
//   Select,
//   MenuItem,
//   InputLabel,
//   Card,
//   CardContent,
//   styled
// } from '@mui/material'
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid
// } from 'recharts'
// import { MonetizationOnOutlined, BoltOutlined, OpacityOutlined, HomeOutlined, MeetingRoomOutlined } from '@mui/icons-material'
// import TextField from '@mui/material/TextField'
// import { fetchHostelsAPI } from '~/apis'
// import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import dayjs from 'dayjs'
// import { useDispatch, useSelector } from 'react-redux'
// import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'

// const mockData = [
//   { hostel: 'Nhà trọ A', room: 'Phòng 101', year: 2023, month: 'Jan', electricity: 120, water: 60, revenue: 2000000 },
//   { hostel: 'Nhà trọ A', room: 'Phòng 101', year: 2023, month: 'Feb', electricity: 135, water: 58, revenue: 2100000 },
//   { hostel: 'Nhà trọ A', room: 'Phòng 102', year: 2023, month: 'Jan', electricity: 110, water: 50, revenue: 1800000 },
//   { hostel: 'Nhà trọ B', room: 'Phòng 201', year: 2023, month: 'Jan', electricity: 150, water: 70, revenue: 2500000 },
//   { hostel: 'Nhà trọ B', room: 'Phòng 202', year: 2023, month: 'Feb', electricity: 160, water: 75, revenue: 2600000 },
//   { hostel: 'Nhà trọ A', room: 'Phòng 102', year: 2023, month: 'Feb', electricity: 115, water: 55, revenue: 1900000 },
//   { hostel: 'Nhà trọ A', room: 'Phòng 101', year: 2022, month: 'Dec', electricity: 125, water: 62, revenue: 2050000 },
//   { hostel: 'Nhà trọ B', room: 'Phòng 201', year: 2022, month: 'Dec', electricity: 140, water: 68, revenue: 2450000 },
//   { hostel: 'Nhà trọ C', room: 'Phòng 301', year: 2023, month: 'Jan', electricity: 130, water: 65, revenue: 2300000 },
//   { hostel: 'Nhà trọ C', room: 'Phòng 302', year: 2023, month: 'Feb', electricity: 140, water: 70, revenue: 2400000 }
// ]

// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// const StyledSelect = styled(Select)(({ theme }) => ({
//   color: '#33475b',
//   backgroundColor: '#f0f5fa',
//   borderRadius: 8,
//   '& .MuiOutlinedInput-notchedOutline': {
//     borderColor: '#8497a6'
//   },
//   '&:hover .MuiOutlinedInput-notchedOutline': {
//     borderColor: '#6c8dbd'
//   },
//   '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//     borderColor: '#3f51b5',
//     borderWidth: 2
//   },
//   '& .MuiSvgIcon-root': {
//     color: '#33475b',
//     fontSize: 28
//   },
//   '& .MuiSelect-select': {
//     padding: '12.5px 40px 12.5px 16px',
//     fontWeight: 600,
//     fontSize: 16
//   },
//   transition: 'all 0.3s ease',
//   boxShadow: 'none',
//   '&:hover': {
//     backgroundColor: '#e1e8f8',
//     boxShadow: 'none'
//   }
// }))

// const StyledInputLabel = styled(InputLabel)(() => ({
//   color: '#33475b',
//   fontWeight: 600,
//   fontSize: 16
// }))


// function Report() {
//   const [selectedHostel, setSelectedHostel] = useState('')
//   const [selectedRoomId, setSelectedRoomId] = useState('')
//   const [selectedYear, setSelectedYear] = useState('')
//   const [selectedMonth, setSelectedMonth] = useState('')
//   const [revenueViewMode, setRevenueViewMode] = useState('year')
//   const [hostels, setHostels] = useState(null)

//   useEffect(() => {
//     fetchHostelsAPI().then((res) => {
//       setHostels(res)
//     })
//   })
//   const years = useMemo(() => [...new Set(mockData.map(d => d.year))], [])

//   const filteredData = useMemo(() =>
//     mockData.filter(d =>
//       (selectedHostel ? d.hostel === selectedHostel : true) &&
//       (selectedRoom ? d.room === selectedRoom : true) &&
//       (selectedYear ? d.year === selectedYear : true) &&
//       (selectedMonth ? d.month === selectedMonth : true)
//     ), [selectedHostel, selectedRoom, selectedYear, selectedMonth])

//   const summary = useMemo(() => ({
//     totalElectricity: filteredData.reduce((sum, d) => sum + d.electricity, 0),
//     totalWater: filteredData.reduce((sum, d) => sum + d.water, 0),
//     totalRevenue: filteredData.reduce((sum, d) => sum + d.revenue, 0)
//   }), [filteredData])

//   const chartDataByMonth = useMemo(() => {
//     if (!selectedYear) return []
//     const dataMap = {}
//     months.forEach(m => {
//       dataMap[m] = { month: m, electricity: 0, water: 0 }
//     })
//     filteredData.forEach(d => {
//       if (dataMap[d.month]) {
//         dataMap[d.month].electricity += d.electricity
//         dataMap[d.month].water += d.water
//       }
//     })
//     return Object.values(dataMap)
//   }, [filteredData, selectedYear])

//   const revenueData = useMemo(() => {
//     if (revenueViewMode === 'year') {
//       const yearMap = {}
//       years.forEach(y => yearMap[y] = { year: y.toString(), revenue: 0 })
//       mockData.forEach(d => {
//         if ((!selectedHostel || d.hostel === selectedHostel) &&
//           (!selectedRoom || d.room === selectedRoom)) {
//           if (yearMap[d.year]) yearMap[d.year].revenue += d.revenue
//         }
//       })
//       return Object.values(yearMap).sort((a, b) => a.year - b.year)
//     } else {
//       if (!selectedYear) return []
//       const monthMap = {}
//       months.forEach(m => monthMap[m] = { month: m, revenue: 0 })
//       mockData.forEach(d => {
//         if ((!selectedHostel || d.hostel === selectedHostel) &&
//           (!selectedRoom || d.room === selectedRoom) &&
//           d.year === selectedYear) {
//           if (monthMap[d.month]) monthMap[d.month].revenue += d.revenue
//         }
//       })
//       return Object.values(monthMap)
//     }
//   }, [revenueViewMode, selectedHostel, selectedRoom, selectedYear, years])


//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         bgcolor: '#e9f0f7',
//         color: '#33475b',
//         fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
//         px: { xs: 2, md: 6 },
//         pt: 6,
//         pb: 10
//       }}
//     >
//       <Typography variant="h3" fontWeight="900" mb={4} sx={{ letterSpacing: 1, textAlign: 'center', color: '#3f51b5' }}>
//         🏠 Báo cáo - Thống kê
//       </Typography>

//       <Paper
//         elevation={4}
//         sx={{
//           mx: 'auto',
//           maxWidth: 1100,
//           mb: 5,
//           p: 4,
//           borderRadius: 4,
//           backgroundColor: '#fff',
//           boxShadow: '0 6px 30px rgba(0,0,0,0.1)'
//         }}
//       >
//         <TextField
//           select
//           fullWidth
//           label="Chọn nhà trọ"
//           margin="normal"
//           defaultValue="Tất cả"
//           sx={{
//             '& .MuiInputBase-root': {
//               borderRadius: '8px'
//             }
//           }}
//           onChange={(e) => {
//             setSelectedHostel(e.target.value)
//           }}
//         >
//           {hostels?.map((hostel) => (
//             <MenuItem key={hostel} value={hostel}>
//               {hostel.hostelName}
//             </MenuItem>
//           ))}
//         </TextField>
//         <TextField
//           select
//           fullWidth
//           label="Chọn phòng trọ"
//           margin="normal"
//           defaultValue=""
//           onChange={(e) => {
//             setSelectedRoomId(e.target.value)
//           }}
//         >
//           {selectedHostel?.rooms?.map((room) => (
//             <MenuItem key={room._id} value={room._id}>
//               {room.roomName}
//             </MenuItem>
//           ))}
//         </TextField>
//         {/* <Grid container spacing={3}>
//           {[{
//             label: 'Chọn Nhà Trọ',
//             value: selectedHostel,
//             onChange: e => { setSelectedHostel(e.target.value); setSelectedRoom('') },
//             options: hostels,
//             disabled: false,
//             key: 'hostel',
//             allText: 'Tất cả'
//           }
//           // }, {
//           //   label: 'Chọn Phòng',
//           //   value: selectedRoom,
//           //   onChange: e => setSelectedRoom(e.target.value),
//           //   options: rooms,
//           //   disabled: !selectedHostel,
//           //   key: 'room',
//           //   allText: 'Tất cả'
//           // }, {
//           //   label: 'Chọn Năm',
//           //   value: selectedYear,
//           //   onChange: e => setSelectedYear(e.target.value),
//           //   options: years,
//           //   disabled: false,
//           //   key: 'year',
//           //   allText: 'Tất cả'
//           // }, {
//           //   label: 'Chọn Tháng',
//           //   value: selectedMonth,
//           //   onChange: e => setSelectedMonth(e.target.value),
//           //   options: months,
//           //   disabled: !selectedYear,
//           //   key: 'month',
//           //   allText: 'Tất cả'
//           // }
//            ].map(({ label, value, onChange, options, disabled, key, allText }) => (
//             <Grid item xs={12} sm={6} md={3} key={key}>
//               <FormControl fullWidth disabled={disabled}>
//                 <StyledInputLabel>{label}</StyledInputLabel>
//                 <StyledSelect
//                   value={value}
//                   onChange={onChange}
//                   label={label}
//                 >
//                   <MenuItem value="" sx={{ fontWeight: 600, fontSize: 16, color: '#33475b' }}> {allText} </MenuItem>
//                   {options.map(opt => (
//                     <MenuItem key={opt._id} value={opt._id} sx={{ fontWeight: 600, fontSize: 16, color: '#33475b' }}>{opt}</MenuItem>
//                   ))}
//                 </StyledSelect>
//               </FormControl>
//             </Grid>
//           ))}
//         </Grid> */}
//       </Paper>

//       <Grid container spacing={4} justifyContent="center" maxWidth={1100} mx="auto" mb={6}>
//         <SummaryCard
//           icon={<HomeOutlined sx={{ color: '#4caf50' }} fontSize="large" />}
//           label="Số nhà trọ"
//           value={hostels.length}
//           bgColor="#e8f5e9"
//         />
//         <SummaryCard
//           icon={<MeetingRoomOutlined sx={{ color: '#f44336' }} fontSize="large" />}
//           label="Số phòng trọ"
//           value={[...new Set(mockData.filter(d => {
//             if (selectedHostel) return d.hostel === selectedHostel
//             return true
//           }).map(d => d.room))].length}
//           bgColor="#ffebee"
//         />
//         <SummaryCard
//           icon={<BoltOutlined sx={{ color: '#ff9800' }} fontSize="large" />}
//           label="Điện tiêu thụ (kWh)"
//           value={summary.totalElectricity}
//           bgColor="#fff3e0"
//         />
//         <SummaryCard
//           icon={<OpacityOutlined sx={{ color: '#2196f3' }} fontSize="large" />}
//           label="Nước tiêu thụ (m³)"
//           value={summary.totalWater}
//           bgColor="#e3f2fd"
//         />
//         <SummaryCard
//           icon={<MonetizationOnOutlined sx={{ color: '#4caf50' }} fontSize="large" />}
//           label="Tổng doanh thu (VND)"
//           value={summary.totalRevenue.toLocaleString()}
//           bgColor="#e8f5e9"
//         />
//       </Grid>

//       <Paper
//         elevation={4}
//         sx={{
//           mx: 'auto',
//           maxWidth: 1100,
//           mb: 6,
//           p: 4,
//           borderRadius: 4,
//           backgroundColor: '#fff',
//           boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Typography variant="h5" fontWeight="bold" color="#3f51b5" mb={3} sx={{ letterSpacing: 1 }}>
//           📊 Tiêu thụ điện & nước theo tháng {selectedYear && `(Năm ${selectedYear})`}
//         </Typography>
//         {!selectedYear ? (
//           <Typography color="text.secondary" fontStyle="italic">Vui lòng chọn năm để xem biểu đồ.</Typography>
//         ) : (
//           <Box sx={{ height: 370 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartDataByMonth} barGap={15} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 <XAxis dataKey="month" stroke="#555" tick={{ fill: '#555', fontWeight: '700' }} />
//                 <YAxis stroke="#555" tick={{ fill: '#555', fontWeight: '700' }} />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: '#fafafa', borderRadius: 10, borderColor: '#ccc', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}
//                   labelStyle={{ color: '#333', fontWeight: 'bold' }}
//                   itemStyle={{ color: '#333' }}
//                 />
//                 <Legend wrapperStyle={{ color: '#555', fontWeight: 'bold' }} />
//                 <Bar dataKey="electricity" fill="#ff9800" radius={[8, 8, 0, 0]} name="Điện (kWh)" />
//                 <Bar dataKey="water" fill="#2196f3" radius={[8, 8, 0, 0]} name="Nước (m³)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </Paper>

//       <Paper
//         elevation={4}
//         sx={{
//           mx: 'auto',
//           maxWidth: 1100,
//           p: 4,
//           borderRadius: 4,
//           backgroundColor: '#fff',
//           boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
//         }}
//       >
//         <Box mb={3} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Typography variant="h5" fontWeight="bold" color="#3f51b5" sx={{ letterSpacing: 1 }}>
//             💰 Doanh thu {revenueViewMode === 'year' ? 'theo năm' : `theo tháng ${selectedYear || ''}`}
//           </Typography>
//           <FormControl size="small" sx={{ minWidth: 140 }}>
//             <StyledInputLabel>Xem theo</StyledInputLabel>
//             <StyledSelect
//               value={revenueViewMode}
//               onChange={(e) => setRevenueViewMode(e.target.value)}
//               label="Xem theo"
//             >
//               <MenuItem value="year" sx={{ fontWeight: 600, fontSize: 16, color: '#33475b' }}>Năm</MenuItem>
//               <MenuItem value="month" disabled={!selectedYear} sx={{ fontWeight: 600, fontSize: 16, color: '#33475b' }}>Tháng trong năm</MenuItem>
//             </StyledSelect>
//           </FormControl>
//         </Box>

//         {revenueViewMode === 'month' && !selectedYear ? (
//           <Typography color="text.secondary" fontStyle="italic">Vui lòng chọn năm để xem doanh thu theo tháng.</Typography>
//         ) : (
//           <Box sx={{ height: 370 }}>
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
//                 {revenueViewMode === 'year' ?
//                   <XAxis dataKey="year" stroke="#555" tick={{ fill: '#555', fontWeight: '700' }} />
//                   :
//                   <XAxis dataKey="month" stroke="#555" tick={{ fill: '#555', fontWeight: '700' }} />
//                 }
//                 <YAxis stroke="#555" tick={{ fill: '#555', fontWeight: '700' }} />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: '#fafafa', borderRadius: 10, borderColor: '#ccc', boxShadow: '0 3px 15px rgba(0,0,0,0.1)' }}
//                   labelStyle={{ color: '#333', fontWeight: 'bold' }}
//                   itemStyle={{ color: '#333' }}
//                 />
//                 <Legend wrapperStyle={{ color: '#555', fontWeight: 'bold' }} />
//                 <Line
//                   type="monotone"
//                   dataKey="revenue"
//                   stroke="#4caf50"
//                   strokeWidth={3}
//                   activeDot={{ r: 8 }}
//                   name="Doanh thu (VND)"
//                   dot={{ stroke: '#388e3c', strokeWidth: 3, fill: '#81c784' }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   )
// }

// function SummaryCard({ icon, label, value, bgColor }) {
//   return (
//     <Grid item xs={12} sm={6} md={2}>
//       <Card
//         sx={{
//           display: 'flex',
//           alignItems: 'center',
//           gap: 2,
//           p: 2.5,
//           backgroundColor: bgColor,
//           color: '#33475b',
//           borderRadius: 4,
//           boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
//           cursor: 'default',
//           transition: 'transform 0.3s ease, box-shadow 0.3s ease',
//           '&:hover': {
//             transform: 'translateY(-6px)',
//             boxShadow: '0 12px 30px rgba(0,0,0,0.1)'
//           }
//         }}
//       >
//         <Box sx={{ fontSize: 42 }}>{icon}</Box>
//         <Box>
//           <Typography variant="subtitle2" fontWeight="600">{label}</Typography>
//           <Typography variant="h6" fontWeight="700" sx={{ mt: 0.5 }}>{value.toLocaleString ? value.toLocaleString() : value}</Typography>
//         </Box>
//       </Card>
//     </Grid>
//   )
// }

// export default Report