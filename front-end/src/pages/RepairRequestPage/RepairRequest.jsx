import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import BuildIcon from '@mui/icons-material/Build'
import { motion } from 'framer-motion'
import AppBar from '~/components/AppBar'
import { fetchHostelsAPI, createNewRepairRequestAPI, uploadImagesAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector, useDispatch } from 'react-redux'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { fetchRequestDetailsAPI, selectCurrentActiveRequest, addActiveRequest } from '~/redux/repairRequest/repairRequestsSlice'
import { singleFileValidator } from '~/utils/validators'
import { REQUETS_STATUS } from '~/utils/constants'
const RepairRequestForm = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const { handleSubmit, control, watch, formState: { errors }, reset } = useForm({
    defaultValues: {
      hostelId: '', // không để undefined
      roomId: ''
    }
  })
  const selectedHostel = watch('hostelId')

  const [rooms, setRooms] = useState([])
  const [hostels, setHostels] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  useEffect(() => {
    // Call API
    dispatch(fetchRequestDetailsAPI())
  }, [dispatch])

  const repairRequests = useSelector(selectCurrentActiveRequest)
  useEffect(() => {
    fetchHostelsAPI().then(res =>
      setHostels(res)
    )
  }, [])
  useEffect(() => {
    if (selectedHostel) {
      const hostel = hostels.find((h) => h._id === selectedHostel)
      const rooms = hostel.rooms.filter(room => room?.memberIds?.includes(user._id))
      setRooms(rooms || [])
    }
  }, [selectedHostel, hostels])

  const uploadAvatar = (e) => {
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    const url = URL.createObjectURL(e.target?.files[0])
    setPreviewUrl(url) // Cập nhật state để hiển thị
    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
  }
  const handleFormSubmit = async (data) => {
    let reqData = new FormData()
    reqData.append('images', data.image)
    const urlImage = await uploadImagesAPI(reqData)
    const newData = {
      ...data,
      image: urlImage
    }
    const promise = createNewRepairRequestAPI(newData)
    toast.promise(
      promise,
      { pending: 'Đang gởi yêu cầu....' }
    ).then(res => {
      if (!res.error) {
        toast.success('Gởi yêu cầu thành công')
      }
      const dataUpdate = {
        ...res,
        hostel: hostels.find((h) => h._id === res.hostelId),
        tenant: user,
        room: rooms?.find(room => room?.memberIds?.includes(user._id))
      }
      dispatch(addActiveRequest(dataUpdate))
      reset({
        hostelId: '',
        roomId: '',
        description: '',
        image: null
      })
      setPreviewUrl('')
    })
  }

  return (
    <>
      <AppBar />
      <Box sx={{ maxWidth: 900, margin: '0 auto', p: 2 }}>
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          sx={{ borderRadius: 4, boxShadow: 6, mb: 4, p: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#fffff' : '#fff') }}
        >
          <CardContent>
            <Typography variant="h4" gutterBottom fontWeight={800} color="primary">
              🛠️ Gửi yêu cầu sửa chữa
            </Typography>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="hostelId"
                    control={control}
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Chọn nhà trọ</InputLabel>
                        <Select {...field} label="Chọn nhà trọ" >
                          {hostels?.map((hostel) => (
                            <MenuItem key={hostel._id} value={hostel._id}>
                              {hostel.hostelName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'hostelId'} />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    name="roomId"
                    control={control}
                    rules={{ required: 'Vui lòng chọn phòng' }}
                    render={({ field, fieldState }) => (
                      <FormControl fullWidth error={!!fieldState.error}>
                        <InputLabel>Chọn phòng</InputLabel>
                        <Select {...field} label="Chọn phòng">
                          {rooms?.map((room) => (
                            <MenuItem key={room._id} value={room._id}>
                              {room.roomName}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'roomId'} />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        label="Mô tả sự cố"
                        fullWidth
                        multiline
                        minRows={4}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{ borderRadius: 2 }}
                      />
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'description'} />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="image"
                    control={control}
                    render={({ field }) => (
                      <Button
                        className='interceptor-loading'
                        component="label"
                        variant="outlined"
                        startIcon={<AddPhotoAlternateIcon />}
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        Tải ảnh minh hoạ
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files[0]
                            field.onChange(file)
                            uploadAvatar(e)
                          }}
                        />
                      </Button>
                    )}
                  />
                </Grid>
                {previewUrl && (
                  <Box display="flex" justifyContent="center" my={2}>
                    <img
                      src={previewUrl}
                      alt="Ảnh xem trước"
                      style={{
                        width: '70%',
                        maxHeight: 400,
                        borderRadius: '8px',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                )}
                <Grid item xs={12}>
                  <Button
                    className='interceptor-loading'
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Gửi yêu cầu'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>

        {repairRequests.length > 0 && (
          <Card component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} sx={{ borderRadius: 4, boxShadow: 4, p: 2 }}>
            <CardContent>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                📋 Yêu cầu đã gửi
              </Typography>
              <List>
                {[...repairRequests].reverse()?.map((req, index) => (
                  <React.Fragment key={req._id || index}>
                    <ListItem alignItems="flex-start" sx={{ alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <BuildIcon />
                      </Avatar>
                      <ListItemText
                        primary={<Typography fontWeight={600}>{req.description}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Nhà trọ: <strong>{req.hostel?.hostelName || 'Không rõ'}</strong> | Phòng: <strong>{req.room?.roomName || 'Không rõ'}</strong>
                            </Typography>
                          </>
                        }
                      />
                      {/* Hình ảnh */}
                      {req.image && (
                        <Box
                          component="img"
                          src={req.image}
                          alt="repair"
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 2,
                            objectFit: 'cover',
                            ml: 2,
                            boxShadow: 1
                          }}
                        />
                      )}
                      <Chip label={req.status} color={req.status === REQUETS_STATUS.ACCEPTED && 'success' || req.status === REQUETS_STATUS.REJECTED && 'error' || req.status === REQUETS_STATUS.PENDING && 'secondary'} variant="outlined" sx={{ ml: 2 }} />
                    </ListItem>
                    {index < repairRequests.length - 1 && <Divider component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Box>
    </>

  )
}

export default RepairRequestForm