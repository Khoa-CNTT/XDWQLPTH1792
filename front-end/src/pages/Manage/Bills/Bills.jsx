// Bills.js
import { useState, useEffect } from 'react'
import { Box, Typography, Button, Paper, Divider, TextField, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { DataGrid } from '@mui/x-data-grid'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import Select from '@mui/material/Select'
import { useTheme } from '@mui/material/styles'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
import { fetchHostelsByOwnerIdAPI, fetchBillsByHostelIdAPI, fetchUtilitiesByRoomIdAPI, createNewBillAPI, updateBillAPI, deleteBillAPI } from '~/apis'
import {
  FIELD_REQUIRED_MESSAGE, POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import InputAdornment from '@mui/material/InputAdornment'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { BILL_STATUS } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
function Bills() {
  const [utilities, setUtilities] = useState([])
  const [hostels, setHostels] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [rows, setRows] = useState(null)
  const [editingBill, setEditingBill] = useState(null)
  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()

  const confirmDelete = useConfirm()
  const handCloseDialog = () => {
    setOpenDialog(false)
  }
  useEffect(() => {
  }, [refresh])
  useEffect(() => {
    fetchHostelsByOwnerIdAPI().then(res => {
      setHostels(res)
      if (res.length > 0) {
        setSelectedHostel(res[0]._id) // Đặt nhà trọ đầu tiên làm mặc định
      }
    }
    )
  }, []) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi
  useEffect(() => {
    // Call API
    if (selectedHostel) {
      dispatch(fetchHostelDetailsAPI(selectedHostel))
    }
  }, [dispatch, selectedHostel])
  useEffect(() => {
    // Call API
    if (selectedRoom) {
      fetchUtilitiesByRoomIdAPI({ roomId: selectedRoom }).then((res) => {
        setUtilities(res)
      })
    }
  }, [selectedRoom])
  const hostel = useSelector(selectCurrentActiveHostel)
  useEffect(() => {
    // Call API
    if (selectedHostel) {
      fetchBillsByHostelIdAPI({ hostelId: selectedHostel }).then((res) => {
        const formattedData = res.map((item, index) => (
          {
            ...item,
            id: item._id, // Đảm bảo mỗi đối tượng có trường `id`
            stt: (index + 1).toString(), // Đảm bảo mỗi đối tượng có trường `id`
            roomName: item.roomInfo.roomName, // Hiển thị tổng số phòng
            month: item.utilityInfo?.month, // Hiển thị tổng số phòng
            extraFees: item.extraFees, // Hiển thị tổng số phòng
            totalAmount: item.totalAmount, // Hiển thị tổng số phòng
            createdAt: new Intl.DateTimeFormat('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }).format(new Date(item.createdAt)) // Định dạng ngày tạo
          }))
        setRows(formattedData) // Lưu dữ liệu vào state
      })
    }
  }, [selectedHostel, refresh])
  const onSubmit = (data) => {
    if (editingBill) {
      delete data.expenseTitle
      delete data.extraFees
      delete data.roomId
      delete data.utilityId
      if (editingBill.status === BILL_STATUS.SUCCESS) {
        toast.error('Không thể cập nhật hóa đơn khi đã thanh toán')
        handCloseDialog()
      } else {
        confirmDelete({
          // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
          title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Cập nhật nhà trọ
          </Box>,
          description: 'Bạn có chắc chắn muốn cập nhật tiện ích này không?',
          confirmationText: 'Confirm',
          cancellationText: 'Cancel'
        }).then(() => {
          // Gọi API cập nhật nhà trọ ở đây
          updateBillAPI(editingBill._id, data).then(res => {
            if (!res.error) {
              toast.success('Cập nhật thành công')
            }
            setRefresh(prev => !prev)
            handCloseDialog()
          })
        })
      }
    } else {
      data.hostelId = selectedHostel
      const promise = createNewBillAPI(data)
      toast.promise(
        promise,
        { pending: 'Đang tạo hóa đơn...' }
      ).then((res) => {
        if (!res.error) {
          toast.success('Tạo thành công')
        }
        setRefresh(prev => !prev)
        setOpenDialog(false)
      })
    }
  }

  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.4, headerAlign: 'center' },
    { field: 'roomName', headerName: 'Phòng', flex: 0.9, headerAlign: 'center' },
    { field: 'month', headerName: 'Tháng', flex: 0.6, headerAlign: 'center' },
    { field: 'extraFees', headerName: 'Phí phát sinh', flex: 0.8, headerAlign: 'center' },
    { field: 'totalAmount', headerName: 'Tổng tiền', flex: 0.7, headerAlign: 'center' },
    { field: 'status', headerName: 'Trạng thái', flex: 0.7, headerAlign: 'center' },
    { field: 'createdAt', headerName: 'Ngày tạo', flex: 0.7, headerAlign: 'center' },
    {
      field: 'actions',
      headerAlign: 'center',
      headerName: 'Hành động',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button className='interceptor-loading' size="small" variant="outlined" color="primary" onClick={() => handleEdit(params.row)}>Cập nhật</Button>
          <Button className='interceptor-loading' variant="outlined" color="secondary" onClick={() => handleDeleteBill(params.row)}>
            Xóa
          </Button>
        </Box>
      ),
      flex: 0.8
    }
  ]

  const handleDeleteBill = (data) => {
    confirmDelete({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Xóa nhà trọ
      </Box>,
      description: 'Bạn có chắc chắn muốn xóa hóa đơn này không?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      // Gọi API cập nhật nhà trọ ở đây
      if (data.status !== BILL_STATUS.SUCCESS) {
        const detail = {
          billId: data.id,
          roomId: data.roomId
        }
        deleteBillAPI(detail).then(res => {
          if (!res.error) {
            toast.success('Xóa thành công')
          }
          setRefresh(prev => !prev)
          handCloseDialog()
        })
      } else {
        toast.error('Hóa đơn này đã được thanh toán không thể xóa')
      }
    })
  }
  const handleHostelChange = (event) => {
    setSelectedHostel(event.target.value)
  }
  const handleEdit = (bill) => {
    setEditingBill(bill) // Lưu thông tin nhà trọ vào state
    setValue('roomId', bill.roomId) // Điền dữ liệu vào form
    setValue('extraFees', bill.extraFees)
    setValue('expenseTitle', bill.expenseTitle) // Điền dữ liệu vào form
    setValue('utilityId', bill.utilityId)
    setValue('status', bill.status) // Điền dữ liệu vào form
    setOpenDialog(true) // Mở Dialog
  }
  const theme = useTheme() // Lấy thông tin theme
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" textAlign="center">Quản Lý Hóa Đơn</Typography>
      <Divider />

      <Box sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Select
          value={selectedHostel}
          onChange={handleHostelChange}
          sx={{
            width: 200,
            backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#fff',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
            borderRadius: 1,
            boxShadow: theme.palette.mode === 'dark' ? '0px 2px 5px rgba(0, 0, 0, 0.5)' : '0px 2px 5px rgba(0, 0, 0, 0.1)'
          }}
        >
          {hostels?.map((hostel) => (
            <MenuItem key={hostel._id} value={hostel._id}>
              {hostel.hostelName}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" color='success' startIcon={<AddIcon />} onClick={() => {
          reset()
          setOpenDialog(true)
        }}>
          Tạo Hóa Đơn
        </Button>
      </Box>

      <Paper sx={{ height: 450 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          sx={{
            border: 0,
            cursor: 'pointer',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: theme.palette.mode === 'dark' ? '#444' : '#f5f5f5',
              color: theme.palette.mode === 'dark' ? '#fff' : '#333',
              fontWeight: 'bold',
              fontSize: '1rem'
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#f0f0f0'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.9rem',
              color: theme.palette.mode === 'dark' ? '#ddd' : '#555',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0
            }
          }}
        />
      </Paper>
      {/* Dialog để tạo hóa đơn */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setEditingBill(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
          handCloseDialog()
        }}
        fullWidth
        maxWidth="sm"
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px', // Bo góc mềm mại
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Tăng độ bóng
            padding: '16px' // Thêm khoảng cách bên trong
          }
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            textAlign: 'center', // Căn giữa tiêu đề
            color: '#473C8B',
            borderBottom: '1px solid #E0E0E0',
            paddingBottom: '8px'
          }}
        >
          {editingBill ? 'Cập nhật hóa đơn' : 'Tạo hóa đơn mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px' // Khoảng cách giữa các trường
            }}
          >
            {!editingBill ?
              <>
                <Box sx={{
                  display: 'flex',
                  gap: 2, // Khoảng cách giữa các trường
                  justifyContent: 'space-between', // Căn giữa theo chiều ngang
                  alignItems: 'center', // Căn giữa theo chiều dọc
                  mt: 2 // Thêm khoảng cách phía trên
                }}>
                  <Box sx={{
                    width: '43%'
                  }}>
                    <TextField
                      fullWidth
                      select
                      margin="normal"
                      label='Chọn phòng trọ'
                      variant='outlined'
                      defaultValue=""
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '8px'
                        }
                      }}
                      {...register('roomId', {
                        required: FIELD_REQUIRED_MESSAGE,
                        onChange: (e) => {
                          setSelectedRoom(e.target.value)
                        }
                      })}
                    >
                      {hostel?.rooms?.map((room) => (
                        <MenuItem key={room._id} value={room._id}>
                          {room.roomName}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FieldErrorAlert errors={errors} fieldName={'roomId'} />
                  </Box>

                  <Box sx={{
                    width: '46%'
                  }}>
                    <TextField
                      fullWidth
                      select
                      margin="normal"
                      label='Chọn tiện ích'
                      defaultValue=""
                      variant='outlined'
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '8px'
                        }
                      }}
                      {...register('utilityId', {
                        required: FIELD_REQUIRED_MESSAGE
                      })}
                    >
                      {utilities.map((utility) => (
                        <MenuItem key={utility._id} value={utility._id}>
                          {utility.month}
                        </MenuItem>
                      ))}
                    </TextField>
                    <FieldErrorAlert errors={errors} fieldName={'utilityId'} />
                  </Box>
                </Box>
                <Box sx={{
                  display: 'flex',
                  gap: 2, // Khoảng cách giữa các trường
                  justifyContent: 'space-between', // Căn giữa theo chiều ngang
                  alignItems: 'center', // Căn giữa theo chiều dọc
                  mt: 2 // Thêm khoảng cách phía trên
                }}>
                  <Box sx={{
                    width: '43%'
                  }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Chi phí khác"
                      name="expenseTitle"
                      type="text"
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '8px'
                        }
                      }}
                      {...register('expenseTitle'
                      )}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'expenseTitle'} />
                  </Box>
                  <Box sx={{
                    width: '46%'
                  }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Số tiền"
                      name="extraFees"
                      defaultValue={0}
                      type="text"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">đồng</InputAdornment> // Thêm đơn vị "m"
                      }}
                      sx={{
                        '& .MuiInputBase-root': {
                          borderRadius: '8px'
                        }
                      }}
                      {...register('extraFees', {
                        pattern: {
                          value: POSITIVE_NUMBER_RULE,
                          message: POSITIVE_NUMBER_RULE_MESSAGE
                        }
                      }
                      )}
                    />
                    <FieldErrorAlert errors={errors} fieldName={'extraFees'} />
                  </Box>
                </Box>
              </>
              :
              <Controller
                name="status"
                defaultValue={BILL_STATUS.SUCCESS}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={BILL_STATUS.SUCCESS}
                      control={<Radio size="small" />}
                      label="Thanh toán"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value={BILL_STATUS.PENDING}
                      control={<Radio size="small" />}
                      label="Chưa thanh toán"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                )}
              />
            }
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center', // Căn giữa các nút
              padding: '16px'
            }}
          >
            <Button
              onClick={() => {
                handCloseDialog()
                setEditingBill(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
              }}
              className='interceptor-loading'
              color="error"
              sx={{
                fontWeight: 'bold',
                textTransform: 'none', // Không viết hoa chữ
                borderRadius: '8px'
              }}
            >
              Hủy
            </Button>
            <Button
              className='interceptor-loading'
              color="primary"
              variant="contained"
              sx={{
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: '8px',
                backgroundColor: '#473C8B',
                '&:hover': {
                  backgroundColor: '#5A4FB0'
                }
              }}
              type='submit'
            >
              {editingBill ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    </Box>
  )
}

export default Bills
