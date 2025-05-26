import { useState, useEffect } from 'react'
import { Paper, Box, Typography, Button, TextField, Divider } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import { useForm, Controller } from 'react-hook-form'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import DialogTitle from '@mui/material/DialogTitle'
import {
  FIELD_REQUIRED_MESSAGE,
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { USER_ROLES } from '~/utils/constants'
import { registerUserAPI, deleteAccountAPI, fetchAllAccountsAPI } from '~/apis'
import { toast } from 'react-toastify'
import ModalUpdateAccount from '~/components/Modal/ModalUpdateAccount'
import { useConfirm } from 'material-ui-confirm'
import DeleteIcon from '@mui/icons-material/Delete'
function Accounts() {
  // Mở modal updateAccount
  const [open, setOpen] = useState(false)
  const [account, setAccount] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [accounts, setAccounts] = useState([])
  const theme = useTheme() // Lấy thông tin theme
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpenDialog = () => {
    reset({ email: '', password: '', password_comfirmation: '' })
    setOpenDialog(true)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false)
  }
  const { register, handleSubmit, reset, control, formState: { errors }, watch } = useForm()
  useEffect(() => {
    // fetch dữ liệu tài khoản từ API
    fetchAllAccountsAPI().then(res => {
      const formattedData = res?.map((item, index) => (
        {
          ...item,
          id: item._id, // Đảm bảo mỗi đối tượng có trường `id`
          stt: (index + 1).toString(), // Đảm bảo mỗi đối tượng có trường `id`
          createAt: new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(new Date(item?.createdAt)) // Định dạng ngày tạo
        }))
      setAccounts(formattedData)
    })
  }, [refresh])

  const createNewAccount = (data) => {
    const { email, password, role } = data
    toast.promise(
      registerUserAPI({ email, password, role }),
      { pending: 'Registration is in progress....' }
    ).then(
      setRefresh(prev => !prev),
      handleCloseDialog()
    )
  }

  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.4 },
    {
      field: 'avatar',
      headerName: 'Hình ảnh',
      headerAlign: 'center',
      width: 150,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="avatar"
          style={{
            width: 'auto', // Tăng chiều rộng hình ảnh
            height: '100%', // Đặt chiều cao hình ảnh bằng chiều cao của ô
            maxHeight: '150px', // Đặt chiều cao tối đa
            objectFit: 'cover'
          }}
        />
      )
    },
    { field: 'displayName', headerName: 'Tên Tài Khoản', flex: 1.5, headerAlign: 'center' },
    { field: 'email', headerName: 'Email', flex: 2, headerAlign: 'center' },
    { field: 'isActive', headerName: 'Xác thực', flex: 0.8, headerAlign: 'center' },
    { field: '_destroy', headerName: 'Đã khóa', flex: 1, headerAlign: 'center' },
    { field: 'role', headerName: 'Quyền', flex: 1, headerAlign: 'center' },
    { field: 'createAt', headerName: 'Ngày Tạo', flex: 0.7, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Hành Động',
      headerAlign: 'center',
      width: 190, // Tăng chiều rộng để chứa cả hai nút
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" color="primary" onClick={() => {
            setAccount(params.row)
            setOpen(true)
          }}>
            Cập nhật
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => handleDeleteAccount(params.row)}>
            Xóa
          </Button>
        </Box>
      )
    }
  ]
  const confirmDelete = useConfirm()
  const handleDeleteAccount = (data) => {
    console.log('dataClick', data)
    if (data._destroy) return
    confirmDelete({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteIcon sx={{ color: 'warning.dark' }} /> Xóa tài khoản
      </Box>,
      description: 'Bạn có chắc chắn muốn khóa tài khoản này không?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const promise = deleteAccountAPI(data.id)
      toast.promise(
        promise,
        { pending: 'Đang khóa tài khoản' }
      ).then((res) => {
        if (!res.error) {
          toast.success('Khóa thành công')
          setRefresh(prev => !prev)
        }
      }
      )
    })
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography variant="h4" color="primary" sx={{ textAlign: 'center' }}>Quản Lý Tài Khoản</Typography>
      <Divider />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Tạo Tài Khoản
        </Button>
      </Box>

      {/* Hiển thị danh sách tài khoản */}
      <Paper sx={{ height: 450, width: '100%' }}>
        <DataGrid
          rows={accounts}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          rowHeight={100}
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
      {/* Dialog Tạo Tài Khoản */}
      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{
        '& .MuiDialog-paper': {
          borderRadius: '12px',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          padding: '24px',
          backgroundColor: theme.palette.background.paper
        }
      }}>
        <form onSubmit={handleSubmit(createNewAccount)}>
          <DialogTitle sx={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Tạo Tài Khoản Mới
          </DialogTitle>
          <DialogContent sx={{ paddingTop: '16px' }}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.divider
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
              error={!!errors['email']}
              {...register('email', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: EMAIL_RULE,
                  message: EMAIL_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'email'} />
            <TextField
              label="Mật Khẩu"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.divider
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
              {...register('password', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: PASSWORD_RULE,
                  message: PASSWORD_RULE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'password'} />
            <TextField
              label="Nhập lại mật khẩu..."
              type="password"
              fullWidth
              margin="normal"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.divider
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main
                  }
                }
              }}
              error={!!errors['password_comfirmation']}
              {...register('password_comfirmation', {
                validate: (value) => {
                  if (value === watch('password')) return true
                  return 'Password comfirmation does not match'
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'password_comfirmation'} />
            <Controller
              name="role"
              defaultValue={USER_ROLES.LANDLORD}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={(event, value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value={USER_ROLES.LANDLORD}
                    control={<Radio size="small" />}
                    label="Chủ trọ"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={USER_ROLES.CLIENT}
                    control={<Radio size="small" />}
                    label="Khách hàng"
                    labelPlacement="start"
                  />
                </RadioGroup>
              )}
            />
          </DialogContent>
          <DialogActions sx={{ paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleCloseDialog}
              color="primary"
              sx={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.grey[200]
                }
              }}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              color="primary"
              sx={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Tạo Tài Khoản
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <ModalUpdateAccount open={open} handleClose={() => setOpen(false)} account={account} setRefresh={setRefresh} />
    </Box>
  )
}

export default Accounts