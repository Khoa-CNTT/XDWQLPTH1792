import { useState, useEffect } from 'react'
import { fetchRoomDetailsAPI, selectCurrentActiveRoom, updateCurrentActiveRoom } from '~/redux/activeRoom/activeRoomSlice'
import { useDispatch, useSelector } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  FormControl
} from '@mui/material'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { Box } from '@mui/material'
import Chip from '@mui/material/Chip'
import { useForm } from 'react-hook-form'
import { updateRoomAPI, pullTenantFromRoomAPI } from '~/apis'
import { toast } from 'react-toastify'
import { updateCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useConfirm } from 'material-ui-confirm'
function ModalAddUserToRoom({ open, handleClose, room, hostel }) {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const addTenantToRoom = (data) => {
    data.hostelId = hostel._id
    const result = updateRoomAPI(room.id, data)
    toast.promise(
      result,
      { pending: 'Đang thêm....' }
    ).then(res => {
      if (!res.error) {
        toast.success('Thêm thành công')
      }
      if (res?._id) {
        dispatch(fetchRoomDetailsAPI(res?._id))
      }
      const updatedHostel = {
        ...hostel,
        rooms: hostel.rooms.map((room) =>
          room._id === res._id ? res : room
        )
      }
      dispatch(updateCurrentActiveHostel(updatedHostel))
      handleClose()
    })
  }
  useEffect(() => {
    if (room?.id) {
      dispatch(fetchRoomDetailsAPI(room?.id))
    }
  }, [dispatch, room?.id])

  const romDetail = useSelector(selectCurrentActiveRoom)

  const confirmUpdateOrDelete = useConfirm()
  const handleRemoveTenant = (tenantId) => {
    confirmUpdateOrDelete({
      // Title, Description, Content...vv của gói material-ui-confirm đều có type là ReactNode nên có thể thoải sử dụng MUI components, rất tiện lợi khi cần custom styles
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonRemoveIcon sx={{ color: 'warning.dark' }} /> Xóa thành viên
      </Box>,
      description: 'Bạn có chắc chắn muốn xóa người này ra khỏi phòng không ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const data = {
        tenantId: tenantId,
        roomId: room.id
      }
      const promise = pullTenantFromRoomAPI(data)
      toast.promise(
        promise,
        { pending: 'Đang xóa người thuê....' }
      ).then(res => {
        if (!res.error) {
          toast.success('Xóa thành công')
        }
        if (room?.id) {
          dispatch(fetchRoomDetailsAPI(room?.id))
        }
        const updatedHostel = {
          ...hostel,
          rooms: hostel.rooms.map((room) =>
            room._id === res._id ? res : room
          )
        }
        dispatch(updateCurrentActiveHostel(updatedHostel))
        handleClose()
      })
    })
  }
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm người dùng vào phòng trọ</DialogTitle>
      <form onSubmit={handleSubmit(addTenantToRoom)}>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              select
              fullWidth
              label='Danh sách thành viên'
              variant='outlined'
              defaultValue=""
              {...register('tenantId')}
            >
              {hostel?.tenants?.map((user) => (
                <MenuItem key={user._id} value={user._id}>
                  {user?.displayName}
                </MenuItem>
              ))}

            </TextField>
          </FormControl>
          {/* Danh sách thành viên đã được thêm */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {romDetail?.tenantsInfo?.map((user) => (
              <Chip
                key={user._id}
                label={user.displayName}
                onDelete={() => handleRemoveTenant(user._id)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">Hủy</Button>
          <Button color='success' type="submit" variant="contained">Thêm</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ModalAddUserToRoom