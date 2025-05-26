import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import AddIcon from '@mui/icons-material/Add'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { fetchHostelsByOwnerIdAPI } from '~/apis'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createNewUtilityAPI, deleteUtilityAPI } from '~/apis'
import { useConfirm } from 'material-ui-confirm'
import { useForm } from 'react-hook-form'
import InputAdornment from '@mui/material/InputAdornment'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import {
  FIELD_REQUIRED_MESSAGE, POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'

import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { fetchUtilitiesByHostelIdAPI, selectCurrentUtilities, removeItilities, updateUtilityAPI } from '~/redux/utilitiy/utilitiesSlice'
import { compareData } from '~/utils/formatters'
function Utility() {
  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmDelete = useConfirm()

  const theme = useTheme() // Lấy thông tin theme
  const [hostels, setHostels] = useState([])
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm()
  // Mở modal user
  const [open, setOpen] = useState(false)
  // Lưu danh sách các tiện ích cần xóa
  const [selectedRows, setSelectedRows] = useState([])

  const [editingUtility, setEditingUtility] = useState(null) // Lưu thông tin nhà trọ đang chỉnh sửa
  const [selectedHostel, setSelectedHostel] = useState(null)
  const dispatch = useDispatch()


  // OnClick của nút "Tạo tiện ích"
  const handleOpen = () => {
    setEditingUtility(null) // Đặt về null để xác định chế độ tạo mới
    reset() // Xóa sạch dữ liệu trong form
    setOpen(true) // Mở Dialog
  }
  const handleClose = () => setOpen(false)
  const handleHostelChange = (event) => {
    setSelectedHostel(event.target.value)
  }
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
  const hostel = useSelector(selectCurrentActiveHostel)

  useEffect(() => {
    // Call API
    if (selectedHostel) {
      dispatch(fetchUtilitiesByHostelIdAPI({ hostelId: selectedHostel }))
    }
  }, [dispatch, selectedHostel])
  const utilities = useSelector(selectCurrentUtilities)

  const handleEdit = (utility) => {
    setEditingUtility(utility) // Lưu thông tin nhà trọ vào state
    setValue('waterStart', utility.waterStart) // Điền dữ liệu vào form
    setValue('waterEnd', utility.waterEnd)
    setValue('electricStart', utility.electricStart) // Điền dữ liệu vào form
    setValue('electricEnd', utility.electricEnd)
    setValue('month', utility.month)
    setValue('roomId', utility.roomId)
    setOpen(true) // Mở Dialog
  }
  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.6 },
    { field: 'roomName', headerName: 'Tên phòng', flex: 2, headerAlign: 'center' },
    { field: 'month', headerName: 'Tháng/Năm', flex: 1.5, headerAlign: 'center' },
    { field: 'waterStart', headerName: 'Nước đầu tháng', flex: 2, headerAlign: 'center' },
    { field: 'waterEnd', headerName: 'Nước cuối tháng', flex: 2, headerAlign: 'center' },
    { field: 'electricStart', headerName: 'Điện đầu tháng', flex: 2, headerAlign: 'center' },
    { field: 'electricEnd', headerName: 'Điện cuối tháng', flex: 2, headerAlign: 'center' },
    { field: 'toltalUtility', headerName: 'Tổng tiền', flex: 1.5, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      width: 200, // Tăng chiều rộng để chứa cả hai nút
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            Cập nhật
          </Button>
        </Box>
      )
    }
  ]
  const rows = utilities?.map((utility, index) => ({
    id: utility?._id,
    stt: index + 1,
    roomName: utility?.roomInfo?.roomName,
    month: utility?.month,
    waterStart: utility?.waterStart,
    waterEnd: utility?.waterEnd,
    electricStart: utility?.electricStart,
    electricEnd: utility?.electricEnd,
    toltalUtility: utility?.toltalUtility,
    ...utility
  }))
  // validate cho tháng tiện ích
  const validateMonth = (value) => {
    const contractMonth = dayjs(value, 'MM/YYYY', true)
    const currentMonth = dayjs()
    if (contractMonth.isAfter(currentMonth)) return 'Tháng tạo tiện ích không thể lớn hơn tháng hiện tại'
    return true
  }
  const createNewUtility = async (data) => {
    if (editingUtility) {
      delete data.roomId
      const dataUpdate = {
        ...data,
        hostelId: hostel._id,
        waterStart: Number(data.waterStart),
        waterEnd: Number(data.waterEnd),
        electricStart: Number(data.electricStart),
        electricEnd: Number(data.electricEnd)
      }
      if (compareData(editingUtility, dataUpdate)) return
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
        dispatch(updateUtilityAPI({ utilityId: editingUtility._id, dataUpdate })).then(res => {
          if (!res.error) {
            toast.success('Cập nhật thành công')
          }
          handleClose()
        })
      })
    } else {
      data.hostelId = hostel._id
      const promise = createNewUtilityAPI(data)
      toast.promise(
        promise,
        { pending: 'Đang tạo....' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Tạo thành công')
        }
        dispatch(fetchUtilitiesByHostelIdAPI({ hostelId: selectedHostel }))
        handleClose()
      })
    }
  }

  // Xóa nhà trọ đã chọn
  const handleDelete = (data) => {
    confirmDelete({
      title: 'Xóa tiện ích',
      description: 'Bạn có chắc chắn muốn xóa tiện ích này không ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      //Update cho chuẩn dữ liệu state board
      // Gọi API xử lý phía BE
      if (data.length === 0) {
        toast.error('Vui lòng chọn tiện ích để xóa')
        return
      }
      const ids = data
      deleteUtilityAPI({ ids }).then(res => {
        toast.success(`Đã xóa thành công ${res.deletedCount} tiện ích`)
        dispatch(removeItilities(ids))
      })
    }).catch()
  }
  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#C0C0C0',
          padding: 2,
          borderRadius: 2,
          boxShadow: theme.palette.mode === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? '#fff' : '#333'
          }}
        >
          Quản lý tiện ích nhà trọ
        </Typography>
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
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1
      }}>
        < Box>
          <Typography sx={{ color: '#473C8B' }} variant='h6'>{('DANH SÁCH CÁC NHÀ TRỌ')}</Typography>
        </Box>
        < Box sx={{
          display: 'flex',
          gap: 1
        }}>
          <Button variant='contained' color='success' onClick={() => handleOpen()} startIcon={<AddIcon />}>
            Tạo
          </Button>
          <Button
            variant='outlined'
            color='error'
            sx={{
              borderWidth: '2px'
            }}
            onClick={() => handleDelete(selectedRows)}
          >
            Xóa
          </Button>
        </Box>

      </Box>
      <Paper
        sx={{
          height: 510,
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: theme.palette.mode === 'dark' ? '0px 4px 10px rgba(0, 0, 0, 0.5)' : '0px 4px 10px rgba(0, 0, 0, 0.1)',
          backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#fff'
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={80} // Tăng chiều cao của hàng
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setSelectedRows(newRowSelectionModel)
          }}
          disableRowSelectionOnClick
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
        // onRowDoubleClick={(params, event) => {
        //   if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
        //     return
        //   }
        //   setUser(params.row)
        //   setOpen(true)
        // }}
        />
      </Paper>
      {/* Dialog để tạo phòng */}
      <Dialog
        open={open}
        onClose={() => {
          setEditingUtility(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
          handleClose()
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
            color: '#473C8B', // Màu sắc nổi bật
            borderBottom: '1px solid #E0E0E0', // Đường kẻ dưới tiêu đề
            paddingBottom: '8px'
          }}
        >
          {editingUtility ? 'Cập nhật tiện ích' : 'Tạo tiện ích mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(createNewUtility)}>
          <DialogContent
            sx={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px' // Khoảng cách giữa các trường
            }}
          >
            <Box sx={{
              display: 'flex',
              gap: 2, // Khoảng cách giữa các trường
              justifyContent: 'space-between', // Căn giữa theo chiều ngang
              alignItems: 'center', // Căn giữa theo chiều dọc
              mt: 2 // Thêm khoảng cách phía trên
            }}>
              {!editingUtility &&
                <Box sx={{
                  width: '43%'
                }}>
                  <TextField
                    fullWidth
                    select
                    margin="normal"
                    label='Chọn phòng trọ'
                    variant='outlined'
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px'
                      }
                    }}
                    {...register('roomId', {
                      required: FIELD_REQUIRED_MESSAGE
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
              }
              <Box sx={{
                width: '46%'
              }}>
                {/**Ngày bắt đầu hợp đồng */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Tháng tạo tiên ích"
                    format='MM/YYYY'
                    // defaultValue={dayjs(currentUser?.dateOfBirth, 'DD/MM/YYYY')}
                    value={dayjs(watch('month'), 'MM/YYYY')}
                    type='date'
                    {...register('month', {
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: validateMonth
                    })}
                    onChange={(date) => {
                      setValue('month', dayjs(date).format('MM/YYYY'))
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: 'normal',
                        variant: 'outlined',
                        error: !!errors?.month,
                        helperText: errors?.month?.message,
                        sx: {
                          '& .MuiInputBase-root': {
                            borderRadius: '8px'
                          }
                        }
                      }
                    }}
                  />
                </LocalizationProvider>
                <FieldErrorAlert errors={errors} fieldName={'month'} />
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
                  label="Số nước đầu tháng"
                  name="waterStart"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">số</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('waterStart', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'waterStart'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Số nước cuối tháng"
                  name="waterEnd"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đồng/chữ</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('waterEnd', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    },
                    validate: (value) => {
                      if (Number(value) > Number(watch('waterStart'))) return true
                      return 'Số diện nước cuối tháng phải lớn hơn số nước đầu tháng'
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'waterEnd'} />
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
                  label="Số điện đầu tháng"
                  name="electricStart"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">số</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('electricStart', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'electricStart'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Số điện cuối tháng"
                  name="electricEnd"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">chữ</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('electricEnd', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    },
                    validate: (value) => {
                      if (Number(value) > Number(watch('electricStart'))) return true
                      return 'Số diện nước cuối tháng phải lớn hơn số nước đầu tháng'
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'electricEnd'} />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center', // Căn giữa các nút
              padding: '16px'
            }}
          >
            <Button
              onClick={() => {
                handleClose()
                setEditingUtility(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
              }}
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
              {editingUtility ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    </>
  )
}
export default Utility