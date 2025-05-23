import {
  Modal,
  Box,
  Typography,
  Avatar,
  Button,
  Stack
} from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
}

function ModalUser({ open, handleClose, user }) {
  if (!user) return null

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-user-title"
      aria-describedby="modal-user-description"
    >
      <Box sx={style}>
        <Stack spacing={2} alignItems="center">
          <Avatar
            alt={user?.displayName}
            src={user?.avatar || '/default-avatar.png'}
            sx={{ width: 80, height: 80 }}
          />
          <Typography id="modal-user-title" variant="h6" component="h2">
            {user.name}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body2"><strong>Tên:</strong> {user?.displayName}</Typography>
            <Typography variant="body2"><strong>Số điện thoại:</strong> {user?.phone}</Typography>
            <Typography variant="body2"><strong>Email:</strong> {user?.email}</Typography>
            <Typography variant="body2"><strong>Giới tính:</strong> {user?.gender}</Typography>
            <Typography variant="body2"><strong>Số căn cước công dân:</strong> {user?.citizenId}</Typography>
            <Typography variant="body2"><strong>Địa chỉ:</strong> {user?.address}</Typography>
            <Typography variant="body2"><strong>Số phòng:</strong> {user?.roomName}</Typography>
          </Box>
          <Stack direction="row" spacing={2} mt={2}>
            <Button className='interceptor-loading' variant="contained" color="primary" onClick={handleClose}>
              Đóng
            </Button>
            {/* <Button variant="outlined" color="success" href={`tel:${user?.phone}`}>
              Gọi
            </Button> */}
          </Stack>
        </Stack>
      </Box>
    </Modal>
  )
}

export default ModalUser