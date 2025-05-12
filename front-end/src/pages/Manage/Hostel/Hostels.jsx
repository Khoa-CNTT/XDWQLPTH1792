
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { capitalizeFirstLetter } from '~/utils/formatters'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import MenuItem from '@mui/material/MenuItem'
import DialogTitle from '@mui/material/DialogTitle'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import AddIcon from '@mui/icons-material/Add'
import { useState, useEffect } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import InputAdornment from '@mui/material/InputAdornment'
import { districtsInDaNang } from '~/utils/constants'

//Upload ảnh
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

import { useForm, Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import {
  INPUT_NAME, INPUT_NAME_MESSAGE, FIELD_REQUIRED_MESSAGE, POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import { uploadImagesAPI, createNewHostelAPI, fetchHostelsAPI, updateHostelAPI, deleteHostelAPI } from '~/apis'

import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'

const paginationModel = { page: 0, pageSize: 10 }
const HOSTEL_TYPE = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}
function Hostel() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [open, setOpen] = useState(false) // Trạng thái mở/đóng của Dialog

  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [wards, setWards] = useState([])
  const [selectedWard, setSelectedWard] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  // Lưu danh sách các nhà trọ cần xóa
  const [selectedRows, setSelectedRows] = useState([])
  // refesh lại danh sách nhà trọ sau khi gọi API
  const [refresh, setRefresh] = useState(false)

  // OnClick của nút "Tạo phòng"
  const handleOpen = () => {
    setEditingHostel(null) // Đặt về null để xác định chế độ tạo mới
    reset({ hostelName: '', address: '', images: '' }) // Xóa sạch dữ liệu trong form
    setPreviewUrl('') // Xóa ảnh xem trước
    setOpen(true) // Mở Dialog
  }
  const handleClose = () => setOpen(false)

  const [editingHostel, setEditingHostel] = useState(null) // Lưu thông tin nhà trọ đang chỉnh sửa

  // OnClick của nút "Cập nhật"
  const handleEdit = (hostel) => {
    const arr = hostel?.address.split(', ')
    setEditingHostel(hostel) // Lưu thông tin nhà trọ vào state
    setValue('hostelName', hostel.hostelName) // Điền dữ liệu vào form
    setValue('streetAddress', arr[0])
    setValue('district', arr[2])
    setSelectedDistrict(arr[2])

    // 2. Tìm danh sách phường từ quận đã chọn
    const district = districtsInDaNang.find(d => d.name === arr[2])
    setWards(district ? district.wards : [])

    // 3. Gán phường
    setValue('ward', arr[1])
    setSelectedWard(arr[1])
    setValue('images', hostel.images) // Điền dữ liệu vào form
    setValue('type', hostel.type)
    setValue('electricity_price', Number(hostel.electricity_price))
    setValue('water_price', Number(hostel.water_price))
    setValue('description', hostel.description)
    setPreviewUrl(hostel.images) // Hiển thị ảnh xem trước
    setOpen(true) // Mở Dialog
  }
  const { register, handleSubmit, setValue, reset, control, formState: { errors } } = useForm()

  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmUpdateOrDelete = useConfirm()

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
  const updateAdress = (data) => {
    const { streetAddress, ward, district } = data
    // Tạo địa chỉ đầy đủ
    const address = `${streetAddress}, ${ward}, ${district}, Đà Nẵng`
    data.address = address
    // Lưu địa chỉ đầy đủ vào một field mới, ví dụ: fullAddress
    setValue('address', address)
    // Xóa 3 trường: address, ward, district
    delete data.streetAddress
    delete data.ward
    delete data.district
  }
  const createNewHostel = async (data) => {
    if (editingHostel) {
      confirmUpdateOrDelete({
        // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
        title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Cập nhật nhà trọ
        </Box>,
        description: 'Bạn có chắc chắn muốn cập nhật nhà trọ này không?',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      }).then(() => {
        updateAdress(data)
        // Gọi API cập nhật nhà trọ ở đây
        const promise = updateHostelAPI(editingHostel.id, data)
        toast.promise(
          promise,
          { pending: 'Đang cập nhật....' }
        ).then(res => {
          if (!res.error) {
            toast.success('Cập nhật thành công')
          }
          setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
          handleClose()
        })
        console.log('data', data)
      })
    } else {
      updateAdress(data)

      //Gọi API tạo mới nhà trọ ở đây
      const promise = createNewHostelAPI(data)
      toast.promise(
        promise,
        { pending: 'Đang tạo....' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Tạo thành công')
        }
        setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
        handleClose()
      })
    }
  }
  // Xóa nhà trọ đã chọn
  const handleDelete = (data) => {
    confirmUpdateOrDelete({
      title: 'Xóa nhà trọ',
      description: 'Bạn có chắc chắn muốn xóa nhà trọ này không? (Sẽ xóa tất cả thông tin phòng trọ của bạn)',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      //Update cho chuẩn dữ liệu state board
      // Gọi API xử lý phía BE
      if (data.length === 0) {
        toast.error('Vui lòng chọn nhà trọ để xóa')
        return
      }
      const ids = data
      deleteHostelAPI({ ids }).then(res => {
        toast.success(`Đã xóa thành công ${res.deletedCount} nhà trọ`)
        setRefresh((prev) => !prev)
      })
    }).catch()
  }
  useEffect(() => {
    fetchHostelsAPI().then(res => {
      const formattedData = res.map((item, index) => (
        {
          ...item,
          id: item._id, // Đảm bảo mỗi đối tượng có trường `id`
          stt: (index + 1).toString(), // Đảm bảo mỗi đối tượng có trường `id`
          roomIds: item.roomIds.length, // Hiển thị tổng số phòng
          createAt: new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(new Date(item.createAt)) // Định dạng ngày tạo
        }))
      setRows(formattedData) // Lưu dữ liệu vào state
    })
  }, [refresh]) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi

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
            objectFit: 'cover'
          }}
        />
      )
    },
    { field: 'hostelName', headerName: 'Tên nhà trọ', flex: 2, headerAlign: 'center' },
    { field: 'address', headerName: 'Địa chỉ', flex: 2, headerAlign: 'center' },
    { field: 'ownerName', headerName: 'Chủ sở hữu', flex: 2, headerAlign: 'center' },
    { field: 'roomIds', headerName: 'Tổng số phòng', flex: 2, headerAlign: 'center' },
    { field: 'createAt', headerName: 'Ngày tạo', flex: 2, headerAlign: 'center' },
    { field: 'type', headerName: 'Công khai', width: 100 },
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
  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1
      }}>
        < Box>
          <Typography sx={{ color: '#473C8B' }} variant='h6'>{capitalizeFirstLetter('DANH SÁCH CÁC NHÀ TRỌ')}</Typography>
        </Box>
        < Box sx={{
          display: 'flex',
          gap: 1
        }}>
          <Button variant='contained' color='success' onClick={handleOpen} startIcon={<AddIcon />}>
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
            // Thay thế bằng hành động bạn muốn thực hiện
            navigate(`/manage/hostel/${params.row.id}`) // Điều hướng đến trang chi tiết phòng
          }}
        />
      </Paper>
      {/* Dialog để tạo phòng */}
      <Dialog
        open={open}
        onClose={() => {
          setEditingHostel(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
          {editingHostel ? 'Cập nhật nhà trọ' : 'Tạo nhà trọ mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(createNewHostel)}>
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
              label="Tên nhà trọ"
              type="text"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px' // Bo góc cho ô nhập liệu
                }
              }}
              {...register('hostelName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: INPUT_NAME,
                  message: INPUT_NAME_MESSAGE
                }
              })}
              error={!!errors['hostelName']}
            />
            <FieldErrorAlert errors={errors} fieldName={'hostelName'} />
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
                  label='Chọn quận'
                  variant='outlined'
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('district', {
                    onChange: (e) => {
                      const districtName = e.target.value
                      setSelectedDistrict(`${e.target.value}, Đà Nẵng`)
                      const district = districtsInDaNang.find(d => d.name === districtName)
                      setWards(district ? district?.wards : [])
                    },
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                >
                  {districtsInDaNang?.map((address) => (
                    <MenuItem key={address.name} value={address.name}>
                      {address.name}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldErrorAlert errors={errors} fieldName={'district'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  fullWidth
                  select
                  margin="normal"
                  label="Chọn phường/xã"
                  type="text"
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  value={selectedWard}
                  {...register('ward', {
                    onChange: (e) => {
                      const wardName = e.target.value
                      setSelectedWard(wardName)
                    },
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                >
                  {wards?.map((ward) => (
                    <MenuItem key={ward} value={ward}>
                      {ward}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldErrorAlert errors={errors} fieldName={'ward'} />
              </Box>
            </Box>
            <TextField
              fullWidth
              label='Nhập địa chỉ'
              variant='outlined'
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px'
                }
              }}
              {...register('streetAddress', {
                onChange: (e) => {
                  setStreetAddress(e.target.value)
                },
                required: FIELD_REQUIRED_MESSAGE
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'streetAddress'} />
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
                  label="Số tiền nước"
                  name="electricity_price"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đồng/số</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('electricity_price', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'electricity_price'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Số tiền điện"
                  name="water_price"
                  type="text"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">đồng/chữ</InputAdornment> // Thêm đơn vị "m"
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                  {...register('water_price', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: POSITIVE_NUMBER_RULE,
                      message: POSITIVE_NUMBER_RULE_MESSAGE
                    }
                  }
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName={'water_price'} />
              </Box>
            </Box>
            <Controller
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
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mô tả"
              type="text"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px' // Bo góc cho ô nhập liệu
                }
              }}
              {...register('description', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              error={!!errors['description']}
            />
            <FieldErrorAlert errors={errors} fieldName={'description'} />
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
                    backgroundColor: '#f5f5f5' // Màu nền khi hover
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
                setEditingHostel(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
              {editingHostel ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >

    </>
  )
}
export default Hostel