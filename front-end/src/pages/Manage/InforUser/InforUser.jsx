import { DataGrid } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import ModalUser from '~/components/Modal/ModalUser'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material/styles'
import { fetchHostelsAPI } from '~/apis'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel, removeTenantActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
import { createNewConversationAPI, updateHostelAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'
import InviteHostelUser from '~/pages/Home/BedsitBar/InviteHostelUser'


function InforUser() {
  const navigate = useNavigate()
  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmDelete = useConfirm()

  const theme = useTheme() // Lấy thông tin theme
  const [hostels, setHostels] = useState([])
  const [user, setUser] = useState(null)

  // Mở modal user
  const [open, setOpen] = useState(false)

  const [selectedHostel, setSelectedHostel] = useState(null)
  const dispatch = useDispatch()

  const handleHostelChange = (event) => {
    setSelectedHostel(event.target.value)
  }
  useEffect(() => {
    fetchHostelsAPI().then(res => {

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
  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.6 },
    {
      field: 'avatar',
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
    { field: 'displayName', headerName: 'Tên', flex: 2, headerAlign: 'center' },
    { field: 'phone', headerName: 'SDT', flex: 1.5, headerAlign: 'center' },
    { field: 'address', headerName: 'Địa chỉ', flex: 2, headerAlign: 'center' },
    { field: 'gender', headerName: 'Giới tính', flex: 1.5, headerAlign: 'center' },
    { field: 'dateOfBirth', headerName: 'Ngày sinh', flex: 2, headerAlign: 'center' },
    { field: 'roomName', headerName: 'Phòng trọ', flex: 1.5, headerAlign: 'center' },
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
            onClick={() => removeTenant(params.row.id)}
          >
            Xóa khỏi trọ
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => createNewConversation(params.row.id)}
          >
            Liên hệ
          </Button>
        </Box>
      )
    }
  ]
  const filteredUsers = hostel?.tenants?.map((user, index) => {
    const room = hostel?.rooms?.find(room =>
      room.memberIds?.map(id => id.toString()).includes(user._id)
    )
    return {
      id: user?._id,
      stt: index + 1,
      avatar: user?.avatar,
      displayName: user?.displayName,
      phone: user?.phone,
      address: user?.address,
      gender: user?.gender === 'male' ? 'Nữ' : 'Nam',
      dateOfBirth: user?.dateOfBirth,
      roomName: room?.roomName || 'Chưa có',
      ...user
    }
  })
  const createNewConversation = async (userId) => {
    const participants = [userId]
    const res = await createNewConversationAPI({ participants })
    navigate(`/home/message/${res._id}`)
  }

  const removeTenant = (data) => {
    const tenantId = data
    confirmDelete({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Xóa người thuê
      </Box>,
      description: 'Bạn có chắc chắn muốn xóa người này ra khỏi trọ không?',
      confirmationText: 'Chấp nhận',
      cancellationText: 'Hủy'
    }).then(() => {
      // Gọi API cập nhật nhà trọ ở đây
      const promise = updateHostelAPI(hostel._id, { tenantId })
      toast.promise(
        promise,
        { pending: 'Đang xóa....' }
      ).then(res => {
        if (!res.error) {
          toast.success('Xóa thành công')
        }
        dispatch(removeTenantActiveHostel(res))
      })
    })
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
          Chọn nhà trọ: {hostel?.hostelName}
        </Typography>
        <InviteHostelUser hostelId={hostel._id} />
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
          rows={filteredUsers}
          columns={columns}
          rowHeight={80} // Tăng chiều cao của hàng
          pageSizeOptions={[5, 10]}
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
          onRowDoubleClick={(params, event) => {
            if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
              return
            }
            setUser(params.row)
            setOpen(true)
          }}
        />
      </Paper>
      <ModalUser open={open} handleClose={() => setOpen(false)} user={user} />
    </>
  )
}

export default InforUser