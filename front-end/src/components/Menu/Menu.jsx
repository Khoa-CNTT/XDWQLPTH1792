import { useState } from 'react'
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

import { Link } from 'react-router-dom'
function Menu() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const [handleOpen, setHandleOpen] = useState(false)

  const handleClick = () => {
    setHandleOpen(!handleOpen)
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" >
      <List>
        <ListItem disablePadding>
            <Link to='/' style={{ color: 'inherit', width:'100%'}}>
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
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary='Nhắn tin' />
          </ListItemButton>
        </ListItem>
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
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <PaymentIcon />
              </ListItemIcon>
              <ListItemText primary="Hóa đơn thanh toán" />
            </ListItemButton>
          </List>
          <List disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <FolderSharedIcon />
              </ListItemIcon>
              <ListItemText primary="Hợp đồng thuê & thời gian hết hạn" />
            </ListItemButton>
          </List>
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