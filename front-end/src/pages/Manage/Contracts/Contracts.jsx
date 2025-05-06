import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { DataGrid } from '@mui/x-data-grid'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { CONSTRACT_STATUS } from '~/utils/constants'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import { useState, useEffect } from 'react'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import InputAdornment from '@mui/material/InputAdornment'
import EditIcon from '@mui/icons-material/Edit'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import ModalContract from '~/components/Modal/ModalContract'
import {
  INPUT_NAME, INPUT_NAME_MESSAGE, FIELD_REQUIRED_MESSAGE, POSITIVE_NUMBER_RULE,
  POSITIVE_NUMBER_RULE_MESSAGE
} from '~/utils/validators'
import { fetchHostelsAPI, createNewContractAPI, fetchContractsAPI } from '~/apis'
import { fetchHostelDetailsAPI, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DatePicker } from '@mui/x-date-pickers'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

function Contracts() {
  const [contractType, setContractType] = useState('rent') // Giá trị mặc định là "Thuê phòng"
  const [filteredRows, setFilteredRows] = useState([])
  const [open, setOpen] = useState(false) // Trạng thái mở/đóng của Dialog
  const [openModal, setOpenModal] = useState(false) // Trạng thái mở/đóng của Dialog
  const [editingContract, setEditingContract] = useState(null) // Lưu thông tin hợp đồng đang chỉnh sửa
  const [hostels, setHostels] = useState([])
  const [contracts, setContracts] = useState([])
  const [selectedHostel, setSelectedHostel] = useState(null)
  const [contract, setContract] = useState(null)
  // refesh lại danh sách hợp đồng sau khi gọi API
  const [refresh, setRefresh] = useState(false)
  const { register, handleSubmit, setValue, watch, getValues, control, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const confirmUpdateOrDelete = useConfirm()
  // OnClick của nút "Tạo phòng"
  const handleOpen = () => {
    setOpen(true) // Mở Dialog
  }
  const handleClose = () => setOpen(false)
  // // Lọc dữ liệu khi giá trị contractType thay đổi
  // useEffect(() => {
  //   if (contractType === 'rent') {
  //     setFilteredRows(allRows.filter((row) => row.role.startsWith('Đã thuê')))
  //   } else if (contractType === 'deposit') {
  //     setFilteredRows(allRows.filter((row) => row.role.startsWith('Cọc')))
  //   }
  // }, [contractType])

  // Gọi API  danh sách tất cả hostel của owner
  useEffect(() => {
    fetchHostelsAPI().then(res => {
      setHostels(res)
    }
    )
  }, []) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi
  // Gọi API thông tin về hostel được chọn
  useEffect(() => {
    // Call API
    if (selectedHostel) {
      dispatch(fetchHostelDetailsAPI(selectedHostel))
    }
  }, [dispatch, selectedHostel])
  // Gọi API lấy tất cả danh sách contract của owner
  useEffect(() => {
    // Call API
    fetchContractsAPI().then(res => {
      const formattedData = res.map((item, index) => (
        {
          ...item,
          id: item._id,
          stt: (index + 1).toString(),
          tenantName: item?.tenantInfo?.displayName,
          roomName: item?.roomInfo?.roomName,
          price: item?.roomInfo?.price,
          deposit: item?.deposit,
          dateStart: item?.dateStart,
          dateEnd: item?.dateEnd,
          status: item?.status
        }))
      setContracts(formattedData) // Lưu dữ liệu vào state
    })
  }, [refresh])

  const handleContractTypeChange = (event) => {
    setContractType(event.target.value)
  }
  const hostel = useSelector(selectCurrentActiveHostel)

  const columns = [
    { field: 'stt', headerName: 'STT', flex: 0.6 },
    { field: 'tenantName', headerName: 'Người thuê', flex: 2, headerAlign: 'center' },
    { field: 'roomName', headerName: 'Tên phòng', flex: 1.5, headerAlign: 'center' },
    { field: 'price', headerName: 'Giá thuê', flex: 2, headerAlign: 'center' },
    { field: 'deposit', headerName: 'Giá đặt cọc', flex: 1.5, headerAlign: 'center' },
    { field: 'dateStart', headerName: 'Ngày bắt đầu', flex: 2, headerAlign: 'center' },
    { field: 'dateEnd', headerName: 'Ngày kết thúc', flex: 1.5, headerAlign: 'center' },
    { field: 'status', headerName: 'Trạng thái', flex: 1.5, headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Hành động',
      headerAlign: 'center',
      width: 120, // Tăng chiều rộng để chứa cả hai nút
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Chỉnh sửa
        </Button>
      )
    }
  ]
  const validateDateContract = (value) => {
    const contractDay = dayjs(value, 'DD/MM/YYYY', true)
    const currentDay = dayjs()
    if (contractDay.isBefore(currentDay)) return 'Hợp đồng không thể nhỏ hơn ngày hiện tại'
    return true
  }
  const validateEndDateContract = (endDate) => {
    const startDate = dayjs(getValues('dateStart'), 'DD/MM/YYYY', true)
    const contractEndDate = dayjs(endDate, 'DD/MM/YYYY', true)
    if (contractEndDate.isBefore(startDate)) return 'Ngày kết thúc phải sau ngày bắt đầu'
    return true
  }
  // Tạo và update hợp đồng
  const createAndUpdateHostel = (data) => {
    // if (editingHostel) {
    //   confirmUpdateOrDelete({
    //     // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
    //     title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    //       <SystemUpdateAltIcon sx={{ color: 'warning.dark' }} /> Cập nhật nhà trọ
    //     </Box>,
    //     description: 'Bạn có chắc chắn muốn cập nhật nhà trọ này không?',
    //     confirmationText: 'Confirm',
    //     cancellationText: 'Cancel'
    //   }).then(() => {
    //     // Gọi API cập nhật nhà trọ ở đây
    //     const promise = updateHostelAPI(editingHostel.id, data)
    //     toast.promise(
    //       promise,
    //       { pending: 'Đang cập nhật....' }
    //     ).then(res => {
    //       if (!res.error) {
    //         toast.success('Cập nhật thành công')
    //       }
    //       setRefresh((prev) => !prev) // Kích hoạt làm mới dữ liệu
    //       handleClose()
    //     })
    //   })
    // } else {
    //Gọi API tạo mới nhà trọ ở đây
    const promise = createNewContractAPI(data)
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
    // }

  }
  return (
    <Box >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}></Box>
      <Typography variant="h5" sx={{ fontWeight: '600' }}>
        Hợp đồng thuê phòng
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup row value={contractType} onChange={handleContractTypeChange}>
          <FormControlLabel value="rent" control={<Radio />} label="Thuê phòng" />
          <FormControlLabel value="deposit" control={<Radio />} label="Đặt cọc phòng" />
        </RadioGroup>
      </FormControl>

      {/* Bảng hợp đồng */}
      <Divider sx={{ my: 2 }} />
      <Paper sx={{ height: 480, width: '100%' }}>
        <DataGrid
          rows={contracts}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          sx={{
            border: 0,
            cursor: 'pointer',
            '& .MuiDataGrid-cell:focus': {
              outline: 'none'
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none'
            }
          }}
          onRowDoubleClick={(params, event) => {
            if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
              return
            }
            setContract(params.row)
            setOpenModal(true)
          }}
        />
      </Paper>

      {/* Nút chức năng */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="contained" color="error" onClick={handleOpen}>
          Tạo hợp đồng
        </Button>
      </Box>
      {/* Dialog để tạo phòng */}
      <Dialog
        open={open}
        onClose={() => {
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
          {editingContract ? 'Cập nhật hợp đồng' : 'Tạo hợp đồng mới'}
        </DialogTitle>
        <form onSubmit={handleSubmit(createAndUpdateHostel)}>
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
              label="Tên hợp đồng"
              type="text"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px' // Bo góc cho ô nhập liệu
                }
              }}
              {...register('contractName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: INPUT_NAME,
                  message: INPUT_NAME_MESSAGE
                }
              })}
              error={!!errors['contractName']}
            />
            <FieldErrorAlert errors={errors} fieldName={'contractName'} />
            <TextField
              fullWidth
              margin="normal"
              label="Nội dung"
              name="content"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px'
                }
              }}
              {...register('content')}
            />
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
                  select
                  fullWidth
                  label="Chọn nhà trọ"
                  margin="normal"
                  defaultValue=""
                  {...register('hostelId', {
                    required: 'Vui lòng chọn nhà trọ',
                    onChange: (e) => {
                      setSelectedHostel(e.target.value)
                    }
                  })}
                  error={!!errors['hostelId']}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  {hostels?.map((hostel) => (
                    <MenuItem key={hostel._id} value={hostel._id}>
                      {hostel.hostelName}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldErrorAlert errors={errors} fieldName={'hostelId'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                <TextField
                  select
                  fullWidth
                  label="Chọn phòng trọ"
                  margin="normal"
                  defaultValue=""
                  {...register('roomId', {
                    required: 'Vui lòng chọn phòng trọ'
                  })}
                  error={!!errors['roomId']}
                  sx={{
                    '& .MuiInputBase-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  {hostel?.rooms?.map((room) => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.roomName}
                    </MenuItem>
                  ))}
                </TextField>
                <FieldErrorAlert errors={errors} fieldName={'roomId'} />
              </Box>
            </Box>
            <TextField
              select
              fullWidth
              label="Chọn người thuê"
              margin="normal"
              defaultValue=""
              {...register('tenantId', {
                required: 'Vui lòng chọn người thuê '
              })}
              error={!!errors['tenantId']}
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px'
                }
              }}
            >
              {hostel?.tenants?.map((tenant) => (
                <MenuItem key={tenant._id} value={tenant._id}>
                  {tenant.displayName}
                </MenuItem>
              ))}
            </TextField>
            <FieldErrorAlert errors={errors} fieldName={'tenantId'} />
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
                {/**Ngày bắt đầu hợp đồng */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày bắt đầu hợp đồng"
                    format='DD/MM/YYYY'
                    // defaultValue={dayjs(currentUser?.dateOfBirth, 'DD/MM/YYYY')}
                    value={dayjs(watch('dateStart'), 'DD/MM/YYYY')}
                    type='date'
                    {...register('dateStart', {
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: validateDateContract
                    })}
                    onChange={(date) => {
                      setValue('dateStart', dayjs(date).format('DD/MM/YYYY'))
                    }}
                  />
                </LocalizationProvider>
                <FieldErrorAlert errors={errors} fieldName={'dateStart'} />
              </Box>
              <Box sx={{
                width: '46%'
              }}>
                {/**Ngày kết thúc hợp đồng */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Ngày kết thúc hợp đồng"
                    format='DD/MM/YYYY'
                    // defaultValue={dayjs(currentUser?.dateOfBirth, 'DD/MM/YYYY')}
                    value={dayjs(watch('dateEnd'), 'DD/MM/YYYY')}
                    type='date'
                    {...register('dateEnd', {
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: validateEndDateContract
                    })}
                    onChange={(date) => {
                      setValue('dateEnd', dayjs(date).format('DD/MM/YYYY'))
                    }}
                  />
                </LocalizationProvider>
                <FieldErrorAlert errors={errors} fieldName={'dateEnd'} />
              </Box>
            </Box>
            {/* <Controller
              name="status"
              defaultValue={CONSTRACT_STATUS.ACTIVE}
              control={control}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  onChange={(event, value) => field.onChange(value)}
                  value={field.value}
                >
                  <FormControlLabel
                    value={CONSTRACT_STATUS.CANCELED}
                    control={<Radio size="small" />}
                    label="Đã hủy"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={CONSTRACT_STATUS.EXPIRED}
                    control={<Radio size="small" />}
                    label="Hết hạn"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={CONSTRACT_STATUS.ACTIVE}
                    control={<Radio size="small" />}
                    label="Hoạt động"
                    labelPlacement="start"
                  />
                </RadioGroup>
              )}
            /> */}
            <TextField
              fullWidth
              margin="normal"
              label="Tiền đặt cọc"
              type="text"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: '8px' // Bo góc cho ô nhập liệu
                }
              }}
              {...register('deposit', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: POSITIVE_NUMBER_RULE,
                  message: POSITIVE_NUMBER_RULE_MESSAGE
                }
              })}
              error={!!errors['deposit']}
            />
            <FieldErrorAlert errors={errors} fieldName={'deposit'} />
          </DialogContent>
          <DialogActions
            sx={{
              justifyContent: 'center', // Căn giữa các nút
              padding: '16px'
            }}
          >
            <Button
              onClick={() => {
                setEditingContract(null) // Xóa trạng thái chỉnh sửa khi đóng Dialog
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
              {editingContract ? 'Cập nhật' : 'Lưu'}
            </Button>
          </DialogActions>
        </form>
      </Dialog >
      <ModalContract open={openModal} handleClose={() => setOpenModal(false)} contract={contract} />
    </Box>
  )
}
export default Contracts