import { Box } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom' // Import useNavigate


import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, logoutUserAPI } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'

import { Link } from 'react-router-dom'
function Profiles() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate() // Khởi tạo useNavigate

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    navigate('/profile') // Điều hướng đến trang Profile
  }


  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)

  const confirmLogout = useConfirm()
  const handleLogout = () => {
    confirmLogout({
      title: 'Log out your account? ',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      // Thực hiện gọi API logout
      dispatch(logoutUserAPI())
    }).catch(() => { })
  }
  return (
    <Box>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ padding: 0 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            alt='GiaHuy'
            src={currentUser?.avatar}
          />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button-profiles'
        }}
      >
        <MenuItem sx={{
          ':hover': {
            color: 'success.light'
          }
        }} onClick={handleProfileClick}>
          <Avatar src={currentUser?.avatar} sx={{ width: 28, height: 28, mr: 2 }} /> Profile
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Thêm tài khoản khác
        </MenuItem>
        <MenuItem onClick={() => {
          navigate('/security')
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{
          '&:hover': {
            color: 'warning.dark',
            '& .logout-icon': {
              color: 'warning.dark'
            }
          }
        }}>
          <ListItemIcon>
            <LogoutIcon className='logout-icon' fontSize="small" />
          </ListItemIcon>
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles