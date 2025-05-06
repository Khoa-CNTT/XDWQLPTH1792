import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MenuIcon from '@mui/icons-material/Menu'
import Tooltip from '@mui/material/Tooltip'
import HomeIcon from '@mui/icons-material/Home'
import HandymanIcon from '@mui/icons-material/Handyman'
import BedIcon from '@mui/icons-material/Bed'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import PaymentIcon from '@mui/icons-material/Payment'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import { fetchHostelsAPI } from '~/apis'
import { Link } from 'react-router-dom'
import GiteIcon from '@mui/icons-material/Gite'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useSelector } from 'react-redux'
import { USER_ROLES } from '~/utils/constants'
function Menu() {

  const user = useSelector(selectCurrentUser)
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen)
  }
  const [handleOpen, setHandleOpen] = useState(false)
  const [hostels, setHostels] = useState(null)
  const handleClick = () => {
    setHandleOpen(!handleOpen)
  }
  useEffect(() => {
    fetchHostelsAPI().then(res =>
      setHostels(res)
    )
  }, []) // Chỉ gọi API khi component được mount lần đầu tiên hoặc khi `refresh` thay đổi

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" >
      <List>
        <ListItem disablePadding>
          <Link to='/' style={{ color: 'inherit', width: '100%' }}>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary='Trang Chủ' />
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
      <Divider />
      <List>
        <Link to='/home/message' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Nhắn tin' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='/home/DetailInforUser' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý thông tin người thuê' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý tài khoản' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='/home/RoomStatus' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý trạng thái phòng' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý tiện ích' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý thanh toán' />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to='' style={{ color: 'inherit' }}>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Quản lý thống kê và báo cáo' />
            </ListItemButton>
          </ListItem>
        </Link>
        <ListItem disablePadding>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <BedIcon />
            </ListItemIcon>
            <ListItemText primary='Trọ của tôi' />
            {handleOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={handleOpen} timeout="auto" unmountOnExit>
          {/** Trả ra danh sách các nhà trọ đã tạo của user */}
          {
            hostels?.map(hostel => (
              <List disablePadding key={hostel._id}>
                <Link to={`/hostel/${hostel._id}`} style={{ color: 'inherit' }}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <GiteIcon sx={{color:'#FF6666'}}/>
                    </ListItemIcon>
                    <ListItemText primary={hostel.hostelName} />
                  </ListItemButton>
                </Link>
              </List>
            ))
          }
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary="Hóa đơn thanh toán" />
            </ListItemButton>
          </List>
          <List disablePadding>
            {/* <Link to='/manage/Contracts' style={{ color: 'inherit' }}>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <ManageSearchIcon />
                </ListItemIcon>
                <ListItemText primary="Hợp đồng thuê & thời gian hết hạn" />
              </ListItemButton>
            </Link> */}
          </List>
          {user.role === USER_ROLES.LANDLORD &&
            <List disablePadding>
              <Link to='/manage/infor-user' style={{ color: 'inherit' }}>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemIcon>
                    <ManageSearchIcon />
                  </ListItemIcon>
                  <ListItemText primary="Quản lý thông tin phòng trọ" />
                </ListItemButton>
              </Link>
            </List>
          }
        </Collapse>
        <ListItem disablePadding>
          <ListItemButton >
            <ListItemIcon>
              <HandymanIcon />
            </ListItemIcon>
            <ListItemText primary='Yêu cầu sửa chữa & hỗ trợ' />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{
      display: 'flex'
    }}>
      <Tooltip title='Menu'>
        <MenuIcon onClick={toggleDrawer(true)} sx={{
          fontSize: '2rem',
          color: 'white',
          cursor: 'pointer',
          '&:hover': {
            color: '#E4EFE7'
          }
        }} />
      </Tooltip>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  )
}
export default Menu