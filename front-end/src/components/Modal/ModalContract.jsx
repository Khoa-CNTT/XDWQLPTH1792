
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Grid
} from '@mui/material'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { useState } from 'react'
function ModalContract({ open, handleClose, contract }) {
  const printRef = useState(null)
  const handleDownloadPdf = async () => {
    const element = printRef.current
    if (!element) {
      return
    }
    const canvas = await html2canvas(element, {
      scale: 2
    })

    const data = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    })
    const imgProperties = pdf.getImageProperties(data)
    const pdfWidth = pdf.internal.pageSize.getWidth()

    const pdfHeight = (imgProperties.height * pdfWidth)/ imgProperties.width
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('example.pdf')
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
      <DialogTitle textAlign='center'>HỢP ĐỒNG THUÊ PHÒNG TRỌ</DialogTitle>
      <DialogContent dividers>
        <Box ref={printRef} id='contract-content' sx={{
          p: 2, margin: '0 auto', // Căn giữa theo chiều ngang
          maxWidth: 800
        }}>
          <Typography align='center' variant='subtitle1'>
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </Typography>
          <Typography align='center' gutterBottom>
            Độc lập - Tự do - Hạnh phúc
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography align='center' variant='subtitle1' sx={{
            fontSize: 20,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            p:4
          }}>
            {`HỢP ĐỒNG THUÊ PHÒNG TRỌ ${contract?.hostelInfo?.hostelName}`}
          </Typography>
          <Typography gutterBottom>Số: HD-{contract?.id || '0001'}</Typography>

          <Box mt={2}>
            <Typography variant='subtitle1' fontWeight='bold'>
              I. Thông tin các bên
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Typography fontWeight='bold'>Bên cho thuê (Bên A):</Typography>
                <Typography>Họ và tên: {contract?.ownerInfo?.displayName}</Typography>
                <Typography>Ngày sinh: {contract?.ownerInfo?.dateOfBirth}</Typography>
                <Typography>Số CCCD: {contract?.ownerInfo?.citizenId}</Typography>
                <Typography>Địa chỉ: {contract?.ownerInfo?.address}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography fontWeight='bold'>Bên thuê (Bên B):</Typography>
                <Typography>Họ và tên: {contract?.tenantInfo?.displayName}</Typography>
                <Typography>Ngày sinh: {contract?.tenantInfo?.dateOfBirth}</Typography>
                <Typography>Số CCCD: {contract?.tenantInfo?.citizenId}</Typography>
                <Typography>Địa chỉ: {contract?.tenantInfo?.address}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Typography variant='subtitle1' fontWeight='bold'>
              II. Thông tin thuê phòng
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Nhà trọ: {contract?.hostelInfo?.hostelName}</Typography>
                <Typography>Địa chỉ: {contract?.hostelInfo?.address}</Typography>
                <Typography>Tên phòng: {contract?.roomInfo?.roomName}</Typography>
                <Typography>Giá thuê: {contract?.roomInfo?.price} VND/tháng</Typography>
                <Typography>Giá đặt cọc: {contract?.deposit} VND</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Ngày bắt đầu: {contract?.dateStart}</Typography>
                <Typography>Ngày kết thúc: {contract?.dateEnd}</Typography>
                <Typography>Trạng thái: {contract?.status}</Typography>
              </Grid>
            </Grid>
          </Box>

          <Box mt={2}>
            <Typography variant='subtitle1' fontWeight='bold'>
              III. Điều khoản chung
            </Typography>
            <Typography>- Bên B thanh toán đúng hạn, tuân thủ nội quy khu trọ.</Typography>
            <Typography>- Bên A cung cấp dịch vụ đầy đủ, đúng thỏa thuận.</Typography>
            <Typography>- Hai bên tự nguyện và cam kết thực hiện đầy đủ các điều khoản.</Typography>
          </Box>

          <Box mt={2}>
            <Typography variant='subtitle1' fontWeight='bold'>
              IV. Chữ ký xác nhận
            </Typography>
            <Grid container spacing={3} mt={2}>
              <Grid item xs={6} textAlign='center'>
                <Typography>Đại diện Bên A</Typography>
                <Typography>(Ký, ghi rõ họ tên)</Typography>
              </Grid>
              <Grid item xs={6} textAlign='center'>
                <Typography>Đại diện Bên B</Typography>
                <Typography>(Ký, ghi rõ họ tên)</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDownloadPdf} variant='contained' color='primary'>
          In hợp đồng
        </Button>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ModalContract