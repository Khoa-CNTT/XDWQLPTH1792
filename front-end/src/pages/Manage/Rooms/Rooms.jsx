
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { toUpperCaseAll } from '~/utils/formatters'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import FormControl from '@mui/material/FormControl'
import DialogTitle from '@mui/material/DialogTitle'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import AddIcon from '@mui/icons-material/Add'
import { useState, useEffect } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import Radio from '@mui/material/Radio'
import { useParams } from 'react-router-dom'
import { fetchHostelDetailsAPI, updateCurrentActiveHostel, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
import { uploadImagesAPI, createNeRoomAPI, deleteRoomAPI, updateRoomAPI } from '~/apis'
import {
  INPUT_NAME,
  INPUT_NAME_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'


import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { cloneDeep } from 'lodash'
const paginationModel = { page: 0, pageSize: 10 }
export const STATUS_ROOM = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied', //Đã thuê
  MAINTENCANCE: 'maintenance' // đã đặt cọc
}
function Rooms() {

  const dispatch = useDispatch()
  const [previewUrl, setPreviewUrl] = useState('')
  const [open, setOpen] = useState(false) // Trạng thái mở/đóng của Dialog
  // Lưu danh sách id các phòng trọ
  const [selectedRows, setSelectedRows] = useState([])

  const handleClose = () => setOpen(false)
  const handleOpen = () => {
    setEditingRoom(null) // Đặt về null để xác định chế độ tạo mới
    reset({ roomName: '', length: '', width: '', images: '' }) // Xóa sạch dữ liệu trong form
    setPreviewUrl('') // Xóa ảnh xem trước
    setOpen(true) // Mở Dialog
  }
  const handleEdit = (room) => {
    const [length, width] = room.acreage?.split('x').map((value) => value.trim()) || ['', ''];
    // Tách chiều dài và chiều rộng từ acreage
    setEditingRoom(room) // Lưu thông tin nhà trọ vào state
    setValue('roomName', room.roomName) // Điền dữ liệu vào form
    setValue('length', length)
    setValue('width', width) // Điền dữ liệu vào form
    setValue('status', room.status) // Điền dữ liệu vào form
    setValue('utilities', room.utilities.split(',')) // Điền dữ liệu vào form
    setValue('price', room.price)
    setValue('images', room.images)
    setPreviewUrl(room.images) // Hiển thị ảnh xem trước
    setOpen(true) // Mở Dialog
  }
  const confirmUpdateOrDelete = useConfirm()
  const { hostelId } = useParams()
  const [editingRoom, setEditingRoom] = useState(null) // Lưu thông tin nhà trọ đang chỉnh sửa

  const { register, handleSubmit, setValue, reset, control, formState: { errors } } = useForm()
  useEffect(() => {
    // Call API
    dispatch(fetchHostelDetailsAPI(hostelId))
  }, [dispatch, hostelId])

  const hostel = useSelector(selectCurrentActiveHostel)

  const uploadAvatar = (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('images', e.target?.files[0])
    // Gọi API...
    const promise = uploadImagesAPI(reqData)
    toast.promise(
      promise,
      { pending: 'Đang tải ảnh lên....' }
    ).then(res => {
      // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
      if (!res.error) {
        toast.success('Tải thành công')
      }
      // Lưu ý, dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input, nếu không thì sẽ không thể chọn cùng 1 file liên
      //tiếp được
      const url = `${res}`
      setPreviewUrl(url)
      setValue('images', url) // Lưu URL vào state hoặc form state nếu cần thiết
      e.target.value = ''
    })

  }
  // Danh sách tiêu dề của bảng
  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.6 },
    {
      field: 'images',
      headerName: 'Hình ảnh',
      headerAlign: 'center',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Hình ảnh"
          style={{
            width: 'auto', // Tăng chiều rộng hình ảnh
            height: '100%', // Đặt chiều cao hình ảnh bằng chiều cao của ô
            maxHeight: '150px', // Đặt chiều cao tối đa
            objectFit: 'cover',
          }}
        />
      )
    },
    { field: 'roomName', headerName: 'Số phòng', flex: 2, headerAlign: 'center' },
    { field: 'acreage', headerName: 'Diện tích', flex: 1.2, headerAlign: 'center' },
    { field: 'utilities', headerName: 'Tiện ích', flex: 2.6, headerAlign: 'center' },
    { field: 'members', headerName: 'Khách thuê', flex: 2, headerAlign: 'center' },
    { field: 'price', headerName: 'Giá', flex: 2, headerAlign: 'center' },
    { field: 'status', headerName: 'Tình trạng', flex: 2, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          Cập nhật
        </Button>
      )
    }
  ]
  const createNewRoom = (data) => {
    if (editingRoom) {
      confirmUpdateOrDelete({
        // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
        title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Cập nhật nhà trọ
        </Box>,
        description: 'Bạn có chắc chắn muốn cập nhật nhà trọ này không?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      }).then(() => {
        // Gọi API cập nhật nhà trọ ở đây
        const promise = updateRoomAPI(editingRoom.id, data)
        toast.promise(
          promise,
          { pending: 'Đang cập nhật....' }
        ).then(res => {
          if (!res.error) {
            toast.success('Cập nhật thành công')
          }
          handleClose()
        })
      })
    } else {
      const roomData = {
        hostelId: hostelId,
        ...data
      }
      const promise = createNeRoomAPI(roomData)
      toast.promise(
        promise,
        { pending: 'Đang tạo....' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Tạo thành công')
          // Tạo một bản sao của hostel và thêm phòng mới vào danh sách rooms
          const updatedHostel = {
            ...hostel,
            roomIds: [...(hostel?.roomIds || []), res._id], // Thêm id phòng mới vào danh sách
            rooms: [...(hostel?.rooms || []), res] // Thêm phòng mới vào danh sách
          }

          dispatch(updateCurrentActiveHostel(updatedHostel))
        }
        handleClose()
      })
    }
  }
  const rows = hostel?.rooms?.filter(room => room && room._id) ?.map((room, index) => ({
    id: room?._id,
    stt: index + 1,
    images: room?.images,
    roomName: room?.roomName,
    price: room?.price,
    acreage: `${room?.length} x ${room?.width}`,
    status: room?.status,
    utilities: room?.utilities?.join(', ') || '',
    members: room.members?.length || 0
  }))

  // Xóa phòng trọ
  const handleDelete = (data) => {
    confirmUpdateOrDelete({
      title: 'Xóa nhà trọ',
      description: 'Bạn có chắc chắn muốn xóa nhà trọ này không?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      //Update cho chuẩn dữ liệu state board
      // Gọi API xử lý phía BE
      if (data.length === 0) {
        toast.error('Vui lòng chọn phòng trọ để xóa')
        return
      }
      deleteRoomAPI({ ids: data }).then(res => {
        toast.success(`Đã xóa thành công ${res.deletedCount} phòng trọ`)
        // Cập nhật lại danh sách phòng trong hostel
        const updatedHostel = {
          ...hostel,
          roomIds: hostel.roomIds.filter(id => !data.includes(id)), // Lọc ra các id không bị xóa
          rooms: hostel.rooms.filter(room => !data.includes(room._id)) // Lọc ra các phòng không bị xóa
        }
        dispatch(updateCurrentActiveHostel(updatedHostel))
      })
    }).catch()
  }
  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1
      }}>
        < Box>
          <Typography sx={{ color: '#473C8B' }} variant='h6'>{toUpperCaseAll(`DANH SÁCH PHÒNG TRỌ CỦA ${hostel.hostelName}`)}</Typography>
        </Box>
        < Box sx={{
          display: 'flex',
          gap: 1
        }}>
          <Button variant='contained' color='success' onClick={handleOpen} startIcon={<AddIcon />}>
            Tạo phòng
          </Button>
          <Button
            variant='outlined'
            color='error'
            sx={{
              borderWidth: '2px'
            }}
            onClick={() => { handleDelete(selectedRows) }}
          >
            Xóa phòng
          </Button>
        </Box>

      </Box>
      <Divider sx={{
        height: '2px'
      }} />
      <Paper sx={{ height: 510, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={100} // Tăng chiều cao của hàng
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection // checkbox vẫn hoạt động bình thường
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setSelectedRows(newRowSelectionModel)
          }}
          sx={{
            border: 0, cursor: 'pointer', '& .MuiDataGrid-cell': {
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 0
            }
          }}
          disableRowSelectionOnClick // để tránh chọn hàng khi bấm vào bất kỳ đâu ngoài checkbox.
          onRowDoubleClick={(params, event) => {
            // Kiểm tra nếu bấm vào checkbox thì không chạy sự kiện khác
            if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
              return
            }
            // Thay thế bằng hành động bạn muốn thực hiện khi bấm đúp vào hàng
          }}
        />
      </Paper>
      {/* Dialog để tạo phòng */}
      <Dialog
        open={open}
        onClose={() => {
          setEditingRoom(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
          {editingRoom ? 'Cập nhật phòng' : 'Tạo phòng mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(createNewRoom)}>
          <DialogContent
            sx={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px' // Khoảng cách giữa các trường
            }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Tên phòng trọ"
              type="text"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px' // Bo góc cho ô nhập liệu
                }
              }}
              {...register('roomName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: INPUT_NAME,
                  message: INPUT_NAME_MESSAGE
                }
              })}
              error={!!errors['roomName']}
            />
            <FieldErrorAlert errors={errors} fieldName={'roomName'} />
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
                  label="Chiều dài"
                  name="length"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('length', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'length'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Chiều rộng"
                  name="width"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">m</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('width', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'width'} />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2, // Khoảng cách giữa các checkbox
                mt: 2 // Thêm khoảng cách phía trên
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tiện ích
              </Typography>
              <FormControl component="fieldset">
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                  <FormControlLabel
                    control={<Checkbox {...register('utilities')} value="Wifi" />}
                    label="Wifi"
                  />
                  <FormControlLabel
                    control={<Checkbox {...register('utilities')} value="Điều hòa" />}
                    label="Điều hòa"
                  />
                  <FormControlLabel
                    control={<Checkbox {...register('utilities')} value="Nước nóng" />}
                    label="Nước nóng"
                  />
                  <FormControlLabel
                    control={<Checkbox {...register('utilities')} value="Bãi đỗ xe" />}
                    label="Bãi đỗ xe"
                  />
                </FormGroup>
              </FormControl>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2, // Khoảng cách giữa các phần
                mt: 2, // Thêm khoảng cách phía trên
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Tình trạng
              </Typography>
              <Controller
                name="status"
                defaultValue="available" // Giá trị mặc định
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row // Hiển thị theo hàng ngang
                    onChange={(event, value) => field.onChange(value)}
                    value={field.value}
                  >
                    <FormControlLabel
                      value={STATUS_ROOM.AVAILABLE}
                      control={<Radio size="small" />}
                      label="Còn trống"
                    />
                    <FormControlLabel
                      value={STATUS_ROOM.OCCUPIED}
                      control={<Radio size="small" />}
                      label="Đã thuê"
                    />
                    <FormControlLabel
                      value={STATUS_ROOM.MAINTENCANCE}
                      control={<Radio size="small" />}
                      label="Bảo trì"
                    />
                  </RadioGroup>
                )}
              />
            </Box>
            {/* <Controller
              name="type"
              defaultValue={HOSTEL_TYPE.PUBLIC}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={(event, value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value={HOSTEL_TYPE.PUBLIC}
                    control={<Radio size="small" />}
                    label="Public"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={HOSTEL_TYPE.PRIVATE}
                    control={<Radio size="small" />}
                    label="Private"
                    labelPlacement="start"
                  />
                </RadioGroup>
              )}
            /> */}
            <TextField
              fullWidth
              margin="normal"
              label="Giá"
              name="price"
              InputProps={{
                endAdornment: <InputAdornment position="end">đồng</InputAdornment> // Thêm đơn vị "m"
              }}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px'
                }
              }}
              {...register('price', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: POSITIVE_NUMBER_RULE,
                  message: POSITIVE_NUMBER_RULE_MESSAGE
                }
              }
              )}
            />
            <FieldErrorAlert errors={errors} fieldName={'price'} />
            {/* Trường upload ảnh */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                mt: 2
              }}
            >
              <Button
                variant="outlined"
                component="label"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  minWidth: '150px', // Đặt chiều rộng tối thiểu để nút không bị thay đổi kích thước
                  '&:hover': {
                    backgroundColor: '#f5f5f5', // Màu nền khi hover
                  },
                }}
              >
                Tải ảnh nhà trọ
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
              {previewUrl && (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Preview"
                  sx={{
                    width: '100%',
                    maxWidth: '300px',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  }}
                />
              )}
              <input
                type="hidden"
                {...register('images', {
                  required: 'Hình ảnh nhà trọ là bắt buộc'
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'images'} />
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
                setEditingRoom(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
                handleClose()
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
              {editingRoom ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    </>
  )
}

export default Rooms