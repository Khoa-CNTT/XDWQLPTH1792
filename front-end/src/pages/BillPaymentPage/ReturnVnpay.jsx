// ReturnVnpay.jsx
import React, { useEffect, useState } from 'react'
import { Container, Typography, CircularProgress, Box, Paper, Grid, Alert } from '@mui/material'
import Button from '@mui/material/Button'
import { useSearchParams } from 'react-router-dom'
import AppBar from '~/components/AppBar'
import { checkVNPayResultAPI } from '~/apis'
import { toast } from 'react-toastify'
import { PAYMENT_STATUS } from '~/utils/constants'

function ReturnVnpay() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading')
  const [paymentData, setPaymentData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = Object.fromEntries([...searchParams])
        setPaymentData(query)
        if (query.vnp_ResponseCode === '00') {
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } catch (error) {
        setStatus('error')
      }
    }

    fetchData()
  }, [searchParams])
  useEffect(() => {
    if (paymentData) {
      checkVNPayResultAPI(paymentData).then((result) => {
        if (result.status === PAYMENT_STATUS.SUCCESS) {
          toast.success('Hóa đơn đã thanh toán thành công')
        }
      })
    }
  })

  return (
    <>
      <AppBar />
      {status === 'loading' ?
        <Container sx={{ textAlign: 'center', mt: 10 }}>
          <CircularProgress />
          <Typography variant="h6" mt={2}>Đang xử lý thanh toán...</Typography>
        </Container>
        :
        <Container maxWidth="sm" sx={{ mt: 5 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Kết quả thanh toán VNPay
            </Typography>

            {status === 'success' && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Giao dịch thành công!
              </Alert>
            )}

            {status === 'failed' && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Giao dịch thất bại!
              </Alert>
            )}

            <Grid container spacing={1}>
              <Grid item xs={6}><strong>Mã đơn hàng:</strong></Grid>
              <Grid item xs={6}>{paymentData?.vnp_TxnRef}</Grid>

              <Grid item xs={6}><strong>Số tiền:</strong></Grid>
              <Grid item xs={6}>{(Number(paymentData?.vnp_Amount) / 100).toLocaleString()} VND</Grid>

              <Grid item xs={6}><strong>Ngân hàng:</strong></Grid>
              <Grid item xs={6}>{paymentData?.vnp_BankCode}</Grid>

              <Grid item xs={6}><strong>Mã giao dịch:</strong></Grid>
              <Grid item xs={6}>{paymentData?.vnp_TransactionNo}</Grid>

              <Grid item xs={6}><strong>Thời gian:</strong></Grid>
              <Grid item xs={6}>{paymentData?.vnp_PayDate}</Grid>
            </Grid>
            <Box mt={4} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                href="/payment"
              >
                Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Container>
      }
    </>
  )
}

export default ReturnVnpay
