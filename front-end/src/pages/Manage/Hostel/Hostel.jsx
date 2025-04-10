
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
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState, useEffect } from 'react'

//Upload ảnh
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { INPUT_NAME, INPUT_NAME_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { uploadImagesAPI, createNewHostelAPI, fetchHostelsAPI, updateHostelAPI } from '~/apis'

import { useConfirm } from 'material-ui-confirm'

const paginationModel = { page: 0, pageSize: 10 }
function Hostel() {
  const [rows, setRows] = useState([])
  const [previewUrl, setPreviewUrl] = useState('')
  const [open, setOpen] = useState(false) // Trạng thái mở/đóng của Dialog

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
    setValue('address', hostel.address),
      setValue('images', hostel.images) // Điền dữ liệu vào form
    setPreviewUrl(hostel.images) // Hiển thị ảnh xem trước
    setOpen(true) // Mở Dialog
  }
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm()

  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmUpdateOrDelete = useConfirm()

  const uploadAvatar = (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    console.log('e.target?.files[0]: ', e.target?.files[0])
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
      { pending: 'Updating....' }
    ).then(res => {
      // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
      if (!res.error) {
        toast.success('Update thành công')
      }
      // Lưu ý, dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input, nếu không thì sẽ không thể chọn cùng 1 file liên
      //tiếp được
      console.log('res: ', res)
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
          <LogoutIcon sx={{ color: 'warning.dark' }} /> Cập nhật nhà trọ
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
        handleClose()
      })
    }
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
            year: 'numeric',
          }).format(new Date(item.createAt)), // Định dạng ngày tạo
        }))
      setRows(formattedData) // Lưu dữ liệu vào state
    })
  }, [])

  const columns = [
    { field: 'stt', headerName: 'STT', flex: 1 },
    { field: 'hostelName', headerName: 'Tên nhà trọ', flex: 2 },
    { field: 'address', headerName: 'Địa chỉ', flex: 2 },
    { field: 'ownerName', headerName: 'Chủ sở hữu', flex: 2 },
    { field: 'roomIds', headerName: 'Tổng số phòng', flex: 2 },
    { field: 'createAt', headerName: 'Ngày tạo', flex: 2 },
    { field: 'type', headerName: 'Công khai', width: 100,},
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleEdit(params.row)}
        >
          Cập nhật
        </Button>
      ),
    },
  ]
  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1,
      }}>
        < Box>
          <Typography sx={{ color: '#473C8B' }} variant='h6'>{capitalizeFirstLetter('DANH SÁCH CÁC PHÒNG TRỌ')}</Typography>
        </Box>
        < Box sx={{
          display: 'flex',
          gap: 1
        }}>
          <Button variant='contained' color='success' onClick={handleOpen}>
            Tạo phòng
          </Button>
          <Button variant='outlined' color='error' sx={{
            borderWidth: '2px'
          }}>
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
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection // checkbox vẫn hoạt động bình thường
          sx={{ border: 0, cursor: 'pointer' }}
          disableRowSelectionOnClick // để tránh chọn hàng khi bấm vào bất kỳ đâu ngoài checkbox.
          onRowClick={(params, event) => {
            // Kiểm tra nếu bấm vào checkbox thì không chạy sự kiện khác
            if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
              return
            }
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
            {/* Trường upload ảnh */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                mt: 2,
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