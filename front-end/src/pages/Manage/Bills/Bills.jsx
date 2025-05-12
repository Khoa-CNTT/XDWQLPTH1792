// Bills.js
import { useState, useEffect } from 'react'
import { Box, Typography, Button, Paper, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

function Bills() {
  const [bills, setBills] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
  
  }, [refresh])

  const onSubmit = (data) => {
    toast.promise(
      { pending: 'Đang tạo hóa đơn...' }
    ).then(() => {
      setOpenDialog(false)
      setRefresh(prev => !prev)
    })
  }

  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.4 },
    { field: 'tenantName', headerName: 'Người thuê', flex: 1 },
    { field: 'roomNumber', headerName: 'Phòng', flex: 0.6 },
    { field: 'month', headerName: 'Tháng', flex: 0.6 },
    { field: 'extraFees', headerName: 'Phí phát sinh', flex: 0.6 },
    { field: 'totalAmount', headerName: 'Tổng tiền', flex: 1 },
    { field: 'status', headerName: 'Trạng thái', flex: 1 },
    { field: 'createdAtFormatted', headerName: 'Ngày tạo', flex: 1 },
    {
      field: 'actions',
      headerName: 'Hành động',
      renderCell: () => (
        <Button size="small" variant="outlined" color="primary">Cập nhật</Button>
      ),
      flex: 0.8
    }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" textAlign="center">Quản Lý Hóa Đơn</Typography>
      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          reset()
          setOpenDialog(true)
        }}>
          Tạo Hóa Đơn
        </Button>
      </Box>

      <Paper sx={{ height: 450 }}>
        <DataGrid
          rows={bills}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Tạo Hóa Đơn Mới</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Người thuê" fullWidth {...register('tenantName', { required: 'Bắt buộc' })} error={!!errors.tenantName} />
            <TextField label="Phòng" fullWidth {...register('roomNumber', { required: 'Bắt buộc' })} />
            <TextField label="Tháng" placeholder="MM-YYYY" fullWidth {...register('month', { required: 'Bắt buộc' })} />
            <TextField label="Tổng tiền (VND)" type="number" fullWidth {...register('totalAmount', { required: 'Bắt buộc' })} />
            <TextField label="Trạng thái" select fullWidth {...register('status')}>
              <MenuItem value="Chưa thanh toán">Chưa thanh toán</MenuItem>
              <MenuItem value="Đã thanh toán">Đã thanh toán</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button type="submit">Tạo</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}

export default Bills
