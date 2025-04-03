import { useState } from 'react'
import { Box, Typography, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Avatar, Grid } from '@mui/material';
import Footer from '~/components/footer/footer';

import AppBar from '~/components/AppBar'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'

import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { INPUT_NAME, INPUT_NAME_MESSAGE, PHONE_NUMBER_RULE, NUMBER_RULE_MESSAGE, CITIZEN_NUMBER, FIELD_REQUIRED_MESSAGE, CITIZEN_NUMBER_MESSAGE } from '~/utils/validators';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';

import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'

import { useForm, Controller } from 'react-hook-form'
function Profile() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  // Những thông tin của user để init vào form (key tương ứng với register phía dưới Field)
  const initialGeneralForm = {
    displayName: currentUser?.displayName,
    dateOfBirth: currentUser?.dateOfBirth,
    gender: currentUser?.gender,
    phone: currentUser?.phone,
    address: currentUser?.address,
    citizenId: currentUser?.citizenId
  }

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm({
    defaultValues: initialGeneralForm
  })
  // Hàm gọi update thông tin user
  const submitChangeGeneralInformation = (data) => {
    console.log('data', data)
    // So sánh dữ liệu mới với dữ liệu ban đầu
    const isDataUnchanged = JSON.stringify(data) === JSON.stringify(initialGeneralForm)
    if (isDataUnchanged) return
    //Gọi API
    toast.promise(
      dispatch(updateUserAPI(data)),
      { pending: 'Updating....' }
    ).then(res => {
      // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
      if (!res.error) {
        toast.success('Update thành công')
      }
    })
  }
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
    reqData.append('avatar', e.target?.files[0])
    // Cách để log được dữ liệu thông qua FormData
    // console.log('reqData: ', reqData)
    // for (const value of reqData.values()) {
    //   console.log('reqData Value: ', value)
    // }

    // Gọi API...
  }

  const validateBirthDate = (value) => {
    const birthDate = dayjs(value, 'DD/MM/YYYY', true)
    const currentDay = dayjs()
    const birthYear = birthDate.year()
    if (birthDate.isAfter(currentDay)) return 'Ngày sinh không thể lớn hơn ngày hiện tại'
    if (birthYear < 1920) return 'Ngày sinh không được nhỏ hơn năm 1920'
    return true
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      p: 0,
      paddingTop: 0,
      paddingBottom: -1,
      minHeight: '100vh',
      backgroundImage: 'url(/src/assets/image/anhrung.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F4EEEE')
    }}>

      <AppBar />
      <Box sx={{ mt: 4, width: '100%', color:(theme) => (theme.palette.mode === 'dark' ? 'white' : 'black') }}></Box>
      <Grid container spacing={2} sx={{ width: '100%', maxWidth: 1200 }}>
        <Grid item xs={12} md={4}>
          <Box sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#373647' : '#D4C9BE'), p: 2, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom>Thông tin cá nhân</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 75, height: 75, mr: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="a" gutterBottom sx={{ fontFamily: 'Times New Roman', fontSize: '26px' }}>{currentUser?.displayName}</Typography>
                <Button variant="outlined" component="label">
                  Upload
                  <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
            <Box sx={{ backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#373647' : '#D4C9BE'), p: 2, borderRadius: 2 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                variant="outlined"
                margin="normal"
                type="text"
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: INPUT_NAME,
                    message: INPUT_NAME_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/**Ngày sinh */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày tháng năm sinh"
                    format='DD/MM/YYYY'
                    defaultValue={dayjs(currentUser?.dateOfBirth)}
                    type='date'
                    {...register('dateOfBirth', {
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: validateBirthDate
                    })}
                    onChange={(date) => {
                      setValue('dateOfBirth', dayjs(date).format('DD/MM/YYYY'))
                    }}
                  />
                </LocalizationProvider>
                <FieldErrorAlert errors={errors} fieldName={'dateOfBirth'} />
                <Controller
                  control={control}
                  name="gender"
                  render={({ field, fieldState }) => {
                    console.log(fieldState?.error?.message)
                    return (
                      <FormControl component="fieldset" margin="normal" sx={{ flex: 1 }}>
                        <FormLabel component="legend">Giới tính</FormLabel>
                        <RadioGroup
                          row
                          {...field} // Truyền đầy đủ value và onChange
                        >
                          <FormControlLabel value="male" control={<Radio />} label="Nam" />
                          <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                          <FormControlLabel value="other" control={<Radio />} label="Khác" />
                        </RadioGroup>
                      </FormControl>
                    )
                  }}
                />

              </Box>
              <TextField
                fullWidth
                label="Điện thoại"
                variant="outlined"
                margin="normal"
                {...register('phone', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PHONE_NUMBER_RULE,
                    message: NUMBER_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'phone'} />
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Tên Email"
                type="text"
                variant="outlined" margin="normal"
              />
              <TextField
                fullWidth
                label="Số CCCD"
                variant="outlined"
                margin="normal"
                {...register('citizenId', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: CITIZEN_NUMBER,
                    message: CITIZEN_NUMBER_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'citizenId'} />
              <TextField
                fullWidth
                label="Địa chỉ"
                variant="outlined"
                margin="normal"
                type='text'
                {...register('address')}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button type='submit' variant="contained" color="primary">Lưu</Button>
              </Box>
            </Box>
          </form>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, width: '100%' }}>
        <Footer />
      </Box>
    </Box>
  );
}

export default Profile