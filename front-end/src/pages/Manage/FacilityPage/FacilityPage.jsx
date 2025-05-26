// File: FacilityPage.jsx
import { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Stack,
  Box,
  Paper,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import HotelIcon from '@mui/icons-material/Hotel'
import WeekendIcon from '@mui/icons-material/Weekend'
import AddIcon from '@mui/icons-material/Add'
import { fetchHostelsByOwnerIdAPI, createNewFacilityAPI, fetchFacilitiesByHostelId, deleteFacilityAPI, updateFacilityAPI } from '~/apis'
import { useTheme } from '@mui/material/styles'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import InputAdornment from '@mui/material/InputAdornment'
import { FACILITY_CONDITION } from '~/utils/constants'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'
import {
  FIELD_REQUIRED_MESSAGE, POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
import { compareData } from '~/utils/formatters'
const itemIcons = {
  'Máy lạnh': <AcUnitIcon color="primary" />,
  'Giường ngủ': <HotelIcon color="secondary" />,
  'Ghế sofa': <WeekendIcon color="warning" />
}

function FacilityPage() {
  const [hostels, setHostels] = useState([])
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [editingFacility, setEditingFacility] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [facilities, setFacilities] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm()

  const dispatch = useDispatch()
  const confirmDelete = useConfirm()
  const handCloseDialog = () => {
    setOpenDialog(false)
  }
  const theme = useTheme()
  useEffect(() => {
    fetchHostelsByOwnerIdAPI().then(res => {
      setHostels(res)
      if (res.length > 0) {
        setSelectedHostel(res[0]._id) // Đặt nhà trọ đầu tiên làm mặc định
      }
    }
    )
  }, []) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi
  const handleHostelChange = (event) => {
    setSelectedHostel(event.target.value)
  }
  useEffect(() => {
    // Call API
    if (selectedHostel) {
      dispatch(fetchHostelDetailsAPI(selectedHostel))
    }
  }, [dispatch, selectedHostel])
  useEffect(() => {
    // Call API
    if (selectedHostel) {
      fetchFacilitiesByHostelId({ hostelId: selectedHostel }).then(res => {
        const formattedData = res.map((item, index) => (
          {
            ...item,
            id: item._id, // Đảm bảo mỗi đối tượng có trường `id`
            stt: (index + 1).toString(), // Đảm bảo mỗi đối tượng có trường `id`
            roomName: item?.room.roomName, // Hiển thị tổng số phòng
            number: item?.number,
            facilityName: item?.facilityName,
            condition: item?.condition
          }))
        setFacilities(formattedData)
      })
    }
  }, [selectedHostel, refresh])
  const hostel = useSelector(selectCurrentActiveHostel)
  const onSubmit = (data) => {
    if (editingFacility) {
      const dataUpdate = {
        ...data,
        number: Number(data.number)
      }
      if (compareData(editingFacility, dataUpdate)) return
      confirmDelete({
        title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon sx={{ color: 'warning.dark' }} /> Cập nhật cơ sở vật chất
        </Box>,
        description: 'Bạn có chắc chắn cập nhật mặt hàng này không?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      }).then(() => {
        const promise = updateFacilityAPI(editingFacility.id, dataUpdate)
        toast.promise(
          promise,
          { pending: 'Đang cập nhật....' }
        ).then(res => {
          if (!res.error) {
            toast.success('Cập nhật thành công')
          }
          setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
          handCloseDialog()
        })
      })
    } else {
      const promise = createNewFacilityAPI(data)
      toast.promise(
        promise,
        { pending: 'Đang tạo....' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Tạo thành công')
        }
        setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
        handCloseDialog()
      })
    }

  }
  const handleEdit = (facility) => {
    setEditingFacility(facility) // Lưu thông tin nhà trọ vào state
    setValue('roomId', facility.roomId) // Điền dữ liệu vào form
    setValue('facilityName', facility.facilityName)
    setValue('number', facility.number) // Điền dữ liệu vào form
    setValue('condition', facility.condition)
    setOpenDialog(true) // Mở Dialog
  }
  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.6, headerAlign: 'center' },
    { field: 'roomName', headerName: 'Phòng', flex: 1, headerAlign: 'center' },
    {
      field: 'facilityName',
      headerName: 'Vật dụng',
      headerAlign: 'center',
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          {itemIcons[params.value] || <></>}
          <span>{params.value}</span>
        </Stack>
      )
    },
    { field: 'number', headerName: 'Số lượng', type: 'number', flex: 0.7, headerAlign: 'center' },
    {
      field: 'condition',
      headerName: 'Tình trạng',
      flex: 1,
      headerAlign: 'center'
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      flex: 1.5,
      headerAlign: 'center',
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="Chỉnh sửa">
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => handleEdit(params.row)}
            >
              Sửa
            </Button>
          </Tooltip>
          <Tooltip title="Xóa vật dụng">
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteFacility(params.row._id)}
            >
              Xóa
            </Button>
          </Tooltip>
        </Stack >
      )
    }
  ]

  // delete facility
  const deleteFacility = (id) => {
    confirmDelete({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon sx={{ color: 'warning.dark' }} /> Xóa cơ sở vật chất
      </Box>,
      description: 'Bạn có chắc chắn muốn xóa này không?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      deleteFacilityAPI(id).then((res) => {
        if (res.error) {
          toast.error(res.message)
        } else {
          toast.success(res.message)
          setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
        }
      }).catch((err) => {
        toast.error('Xảy ra lỗi khi xóa. Vui lòng thử lại.')
      })

    })
  }
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          Quản lý cơ sở vật chất
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
        <Button variant="contained" size="large" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          Thêm vật dụng
        </Button>
      </Stack>

      <Paper elevation={3} sx={{ height: 500, borderRadius: 3, p: 2 }}>
        <DataGrid
          rows={facilities}
          columns={columns}
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } }
          }}
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
          setEditingFacility(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
          {editingFacility ? 'Cập nhật cơ sở vật chất' : 'Tạo cơ sở vật chất'}
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
                    value={watch('roomId') || ''}
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

                <Box sx={{
                  width: '46%'
                }}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Tên vật liệu"
                    name="facilityName"
                    type="text"
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px'
                      }
                    }}
                    {...register('facilityName', {
                      required: FIELD_REQUIRED_MESSAGE
                    }
                    )}
                    onBlur={(e) => {
                      const trimmedValue = e.target.value.trim()
                      setValue('facilityName', trimmedValue, { shouldValidate: true })
                    }}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'facilityName'} />
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
                    label="Số lượng"
                    name="number"
                    type="text"
                    sx={{
                      '& .MuiInputBase-root': {
                        borderRadius: '8px'
                      }
                    }}
                    {...register('number', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: {
                        value: POSITIVE_NUMBER_RULE,
                        message: POSITIVE_NUMBER_RULE_MESSAGE
                      }
                    }
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'number'} />
                </Box>
                <Box sx={{
                  width: '46%'
                }}>

                </Box>
              </Box>
            </>
            {editingFacility &&
              <Controller
                name="condition"
                defaultValue={FACILITY_CONDITION.GOOD}
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={FACILITY_CONDITION.GOOD}
                      control={<Radio size="small" />}
                      label="Tốt"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value={FACILITY_CONDITION.NEED_REPAIR}
                      control={<Radio size="small" />}
                      label="Cần sửa chữa"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value={FACILITY_CONDITION.BROKEN}
                      control={<Radio size="small" />}
                      label="Hỏng"
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
                setEditingFacility(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
              {editingFacility ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    </Container>
  )
}

export default FacilityPage
