import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

import { useSelector } from 'react-redux'
import { selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
const MENU_STYLES = {
  color: 'white', bgcolor: 'transparent', border: 'none', paddingX: '5px', borderRadius: '5px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BedsitBar() {
  const hostel = useSelector(selectCurrentActiveHostel)
  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      background: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : 'linear-gradient(to bottom, #473C8B, #9370DB)')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={hostel?.address}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />} label={hostel?.hostelName} clickable />
        </Tooltip>
        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />} label='Public' clickable />
        {/* <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />} label="Add to Google Drive" clickable />
        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />} label="Automation" clickable />
        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />} label="Filters" clickable /> */}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button variant="outlined" startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            ': hover': {
              borderColor: 'white'
            }
          }}
        >Invite</Button>
        {/* <AvatarGroup
          max={4}
          sx={{
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': {
                bgcolor: '#a4b0de'
              }
            }
          }}
        >
          <Tooltip title='title' >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
          <Tooltip >
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup> */}
        {/** Xử lý hiển thị danh sách thành viên của board */}
      </Box>
    </Box>
  )
}
export default BedsitBar