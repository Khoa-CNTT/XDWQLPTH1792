import { Box } from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import Typography from '@mui/material/Typography'
import ModeSelect from './ModeSelect/ModeSelect'
import TextField from '@mui/material/TextField'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import CloseIcon from '@mui/icons-material/Close'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useState } from 'react'
import Menu from './Menu/Menu'
import Profiles from './Menu/Profiles'
import { Link } from 'react-router-dom'
function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#473C8B')
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Tooltip title='Trang Chủ'>
          <Menu />
        </Tooltip>
        <Link to='/'>
          <Tooltip title='Trang Chủ'>
            <HomeIcon sx={{
              color: 'white',
              cursor: 'pointer',
              fontSize: '30px'
            }} />
          </Tooltip>
        </Link>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>Nhà trọ</Typography>
        </Box>
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <TextField
          id="outlined-basic"
          label="Tìm kiếm nhà trọ"
          type="text"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>),
            endAdornment: (
              <InputAdornment position="start">
                <CloseIcon sx={{
                  color: searchValue ? 'white' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '1.3rem'
                }}
                onClick={() => {
                  setSearchValue('')
                }} />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '& label': {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            '& input': {
              color: 'white'
            },
            '& label.Mui-focused': {
              color: 'white'
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white'
              },
              '&:hover fieldset': {
                borderColor: 'white'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white'
              }
            }

          }} />
        <ModeSelect />
        <Tooltip title="Notification" >
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help" >
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}
export default AppBar