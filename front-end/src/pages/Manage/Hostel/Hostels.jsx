
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
import DialogTitle from '@mui/material/DialogTitle'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import AddIcon from '@mui/icons-material/Add';
import { useState, useEffect } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'

//Upload ảnh
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

import { useForm, Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { INPUT_NAME, INPUT_NAME_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
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
    setEditingHostel(hostel) // Lưu thông tin nhà trọ vào state
    setValue('hostelName', hostel.hostelName) // Điền dữ liệu vào form
    setValue('address', hostel.address)
    setValue('images', hostel.images) // Điền dữ liệu vào form
    setValue('type', hostel.type)
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
  const createNewHostel = (data) => {
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
      })
    } else {
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
      description: 'Bạn có chắc chắn muốn xóa nhà trọ này không?',
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
            objectFit: 'cover',
          }}
        />
      )
    },
    { field: 'hostelName', headerName: 'Tên nhà trọ', flex: 2, headerAlign: 'center' },
    { field: 'address', headerName: 'Địa chỉ', flex: 2,headerAlign: 'center' },
    { field: 'ownerName', headerName: 'Chủ sở hữu', flex: 2, headerAlign: 'center' },
    { field: 'roomIds', headerName: 'Tổng số phòng', flex: 2, headerAlign: 'center' },
    { field: 'createAt', headerName: 'Ngày tạo', flex: 2, headerAlign: 'center' },
    { field: 'type', headerName: 'Công khai', width: 100, },
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
            <TextField
              fullWidth
              margin="normal"
              label="Địa chỉ"
              name="address"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                },
              }}
              {...register('address')}
            />
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