import { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button
} from '@mui/material'
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'
import { Box } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { useForm, Controller } from 'react-hook-form'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import RadioGroup from '@mui/material/RadioGroup'
import { USER_ROLES } from '~/utils/constants'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import { updateAccountAPI } from '~/apis'
import { INPUT_NAME, INPUT_NAME_MESSAGE, PHONE_NUMBER_RULE, NUMBER_RULE_MESSAGE, CITIZEN_NUMBER, FIELD_REQUIRED_MESSAGE, CITIZEN_NUMBER_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { useConfirm } from 'material-ui-confirm'

function ModalUpdateAccount({ open, handleClose, account, setRefresh }) {

  const initialGeneralForm = {
    displayName: account?.displayName,
    phone: account?.phone,
    role: account?.role
  }
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })
  useEffect(() => {
    if (account) {
      reset({
        displayName: account.displayName || '',
        phone: account.phone || '',
        role: account.role
      })
    }
  }, [account, reset])
  const handleSave = (data) => {
    // So sánh dữ liệu mới với dữ liệu ban đầu
    const isDataUnchanged = JSON.stringify(data) === JSON.stringify(initialGeneralForm)
    if (isDataUnchanged) return
    //Gọi API
    confirmUpdateOrDelete({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Cập nhật tài khoản
      </Box>,
      description: 'Bạn có chắc chắn muốn cập nhật tài khoản này không?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      toast.promise(
        updateAccountAPI(account._id, data),
        { pending: 'Updating....' }
      ).then(res => {
        // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
        if (!res.error) {
          toast.success('Update thành công')
          setRefresh(prev => !prev)
        }
      })
      handleClose()
    })
  }
  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmUpdateOrDelete = useConfirm()
  // const [previewUrl, setPreviewUrl] = useState('')
  const uploadAvatar = (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    // // const url = URL.createObjectURL(e.target?.files[0]);
    // setPreviewUrl(url) // Cập nhật state để hiển thị
    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    // // Cách để log được dữ liệu thông qua FormData
    // console.log('reqData: ', reqData)
    // for (const value of reqData.values()) {
    //   console.log('reqData Value: ', value)
    // }
    // Gọi API...
    toast.promise(
      updateAccountAPI(account._id, reqData),
      { pending: 'Updating....' }
    ).then(res => {
      // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
      if (!res.error) {
        toast.success('Update thành công')
        setRefresh(prev => !prev)
        handleClose()
      }
      // Lưu ý, dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input, nếu không thì sẽ không thể chọn cùng 1 file liên
      //tiếp được
      e.target.value = ''
    })
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Cập nhật tài khoản</DialogTitle>
      <form onSubmit={handleSubmit(handleSave)}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 170, height: 170, mb: 2 }} src={account?.avatar} />
            <Button className='interceptor-loading' variant="outlined" component="label">
              Upload
              <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
            </Button>

          </Box>
          {/* {previewUrl && (
          <img
            src={previewUrl}
            alt="Ảnh xem trước"
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover' }}
          />
        )} */}

          <TextField
            margin="normal"
            fullWidth
            label="Họ tên"
            {...register('displayName', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: INPUT_NAME,
                message: INPUT_NAME_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'displayName'} />
          <TextField
            disabled
            margin="normal"
            fullWidth
            label="Email"
            defaultValue={account?.email}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Số điện thoại"
            name="phone"
            {...register('phone', {
              required: FIELD_REQUIRED_MESSAGE,
              pattern: {
                value: PHONE_NUMBER_RULE,
                message: NUMBER_RULE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'phone'} />
          {account?.role !== USER_ROLES.ADMIN &&
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
          }

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button className='interceptor-loading' variant="contained" color="primary" type='submit'>Lưu</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalUpdateAccount