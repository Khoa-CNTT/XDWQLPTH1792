import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import AppBar from '~/components/AppBar'

import { useDispatch } from 'react-redux'
import { logoutUserAPI, updateUserAPI } from '~/redux/user/userSlice'
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'

function SecurityTab() {
  const dispatch = useDispatch()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  // Ôn lại: https://www.npmjs.com/package/material-ui-confirm
  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
      </Box>,
      description: 'Bạn phải đăng nhập lại sau khi đổi mật khẩu. Bạn có muốn tiếp tục?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const { current_password, new_password } = data
      // Gọi API
      toast.promise(
        dispatch(updateUserAPI({ current_password, new_password })),
        { pending: 'Updating...' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thức hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Đã thay đổi mật khẩu thành công. Hãy đăng nhập lại')
          dispatch(logoutUserAPI(false))
        }
      })

      // Gọi API...
    }).catch(() => { })
  }

  return (
    <>
      <AppBar />
      <Box sx={{
        width: '100%',
        height: (theme) => theme.trello.messageHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}>
          <Box>
            <Typography variant="h4" >ĐỔI MẬT KHẨU</Typography>
          </Box>
          <form onSubmit={handleSubmit(submitChangePassword)}>
            <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Nhập mật mã hiện tại"
                  type="password"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('current_password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                  error={!!errors['current_password']}
                />
                <FieldErrorAlert errors={errors} fieldName={'current_password'} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Nhập mật khẩu mới"
                  type="password"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('new_password', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: PASSWORD_RULE,
                      message: PASSWORD_RULE_MESSAGE
                    }
                  })}
                  error={!!errors['new_password']}
                />
                <FieldErrorAlert errors={errors} fieldName={'new_password'} />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockResetIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                  {...register('new_password_confirmation', {
                    validate: (value) => {
                      if (value === watch('new_password')) return true
                      return 'Mật khẩu không đúng với mật khẩu mới.'
                    }
                  })}
                  error={!!errors['new_password_confirmation']}
                />
                <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
              </Box>

              <Box>
                <Button
                  className="interceptor-loading"
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth>
                  Cập nhật
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  )
}

export default SecurityTab
