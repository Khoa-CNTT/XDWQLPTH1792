import React, { useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Grid,
  Button
} from '@mui/material'
import { Payment, ReceiptLong, HomeWork } from '@mui/icons-material'
import AppBar from '~/components/AppBar'
import { useEffect } from 'react'
import { fetchHostelsAPI } from '~/apis'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { fetchBillsByRoomIdAPI, selectCurrentBills } from '~/redux/activeBill/activeBillSlice'
import { BILL_STATUS } from '~/utils/constants'


function BillPaymentPage() {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  console.log('user', user)
  const [selectedHostelId, setSelectedHostelId] = useState('')
  const [selectedBillId, setSelectedBillId] = useState('')
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [hostels, setHostels] = useState(null)
  useEffect(() => {
    fetchHostelsAPI().then(res =>
      setHostels(res)
    )
  }, []) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi
  console.log('selectedHostel', selectedHostel)
  const hostel = hostels?.filter(hostel => hostel._id === selectedHostel)[0]
  console.log('hostel', hostel)
  const room = hostel?.rooms?.filter(room => room.memberIds.includes(user._id))[0]
  useEffect(() => {
    if (room) {
      dispatch(fetchBillsByRoomIdAPI(room._id))
    }
  }, [dispatch, room])
  const bills = useSelector(selectCurrentBills)
  const selectedBill = bills?.filter(bill => bill._id === selectedBillId)[0]
  console.log('selectedBill', selectedBill)
  return (
    <>
      <AppBar />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, minHeight: (theme) => theme.trello.messageHeight, mx: 'auto', backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5') }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
          Thanh Toán Hóa Đơn
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: 4, mb: 4 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <HomeWork color="action" fontSize="large" />
              </Grid>
              <Grid item xs>
                <Typography variant="h6" gutterBottom>
                  Chọn nhà trọ
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Nhà trọ</InputLabel>
                  <Select
                    value={selectedHostelId}
                    label="Nhà trọ"
                    onChange={(e) => {
                      setSelectedHostelId(e.target.value)
                      setSelectedHostel(e.target.value)
                      setSelectedBillId('') // reset bill
                    }}
                  >
                    {hostels?.map((hostel) => (
                      <MenuItem key={hostel._id} value={hostel._id}>
                        {hostel.hostelName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {selectedHostel && (
          <Card sx={{ borderRadius: 4, boxShadow: 4, mb: 4 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <ReceiptLong color="action" fontSize="large" />
                </Grid>
                <Grid item xs>
                  <Typography variant="h6" gutterBottom>
                    Chọn hóa đơn
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Hóa đơn</InputLabel>
                    <Select
                      value={selectedBillId}
                      label="Hóa đơn"
                      onChange={(e) => setSelectedBillId(e.target.value)}
                    >
                      {bills?.map((bill) => (
                        <MenuItem key={bill._id} value={bill._id}>
                          {bill.roomInfo.roomName} - {bill.utilityInfo.month}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {selectedBill && (
          <Card sx={{ borderRadius: 4, boxShadow: 6 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                🧾 Chi tiết hóa đơn: <strong>{selectedBill.roomInfo.roomName} - {selectedBill.utilityInfo.month}</strong>
              </Typography>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={6}>
                  <Typography><strong>Phòng:</strong> {selectedBill.roomInfo.roomName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography><strong>Tháng:</strong> {selectedBill.utilityInfo.month}</Typography>
                </Grid>
              </Grid>

              <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
                <Table>
                  <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                    <TableRow>
                      <TableCell><strong>Hạng mục</strong></TableCell>
                      <TableCell align="right"><strong>Số tiền (VNĐ)</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Tiền trọ cố định</TableCell>
                      <TableCell align="right">{selectedBill.roomInfo.price}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Số nước tiêu thụ</TableCell>
                      <TableCell align="right">{selectedBill.utilityInfo.waterBegin - selectedBill.utilityInfo.waterStart} x {selectedBill.hostelInfo.water_price} đồng/số</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Số điện tiêu thụ</TableCell>
                      <TableCell align="right">{selectedBill.utilityInfo.electricBegin - selectedBill.utilityInfo.electricStart} x {selectedBill.hostelInfo.electricity_price} đồng/số</TableCell>
                    </TableRow>
                    {selectedBill.expenseTitle &&
                      <TableRow>
                        <TableCell>{selectedBill.expenseTitle}</TableCell>
                        <TableCell align="right">{selectedBill?.extraFees?.toLocaleString()}</TableCell>
                      </TableRow>
                    }
                    <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
                      <TableCell><strong>Tổng cộng</strong></TableCell>
                      <TableCell align="right"><strong>{selectedBill.totalAmount?.toLocaleString()}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Box display="flex" justifyContent="flex-end" alignItems="center" mt={2} mb={2}>
                {selectedBill.status === BILL_STATUS.SUCCESS ? (
                  <Typography sx={{ color: 'green', fontWeight: 'bold' }}>✅ Đã thanh toán</Typography>
                ) : (
                  <Typography sx={{ color: 'orange', fontWeight: 'bold' }}>⏳ Chưa thanh toán</Typography>
                )}
              </Box>
              {selectedBill.status !== BILL_STATUS.SUCCESS &&
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Payment />}
                    size="large"
                    sx={{ borderRadius: 3 }}
                    onClick={() => alert(`Thanh toán hóa đơn ${selectedBill.id} thành công!`)}
                  >
                    Thanh toán
                  </Button>
                </Box>
              }
            </CardContent>
          </Card>
        )}
      </Box>
    </>
  )
}
export default BillPaymentPage