import { useState } from 'react'
import AppBar from '~/components/AppBar'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import Hostel from './Hostel/Hostels'
import InforUser from './InforUser/InforUser'
import Container from '@mui/material/Container'

//Tab
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Rooms from './Rooms/Rooms'
const TABS = {
  INFOR_USER: 'infor-user',
  HOSTEL: 'hostel'
}
function Manage() {
  const location = useLocation()
  const getDefaultTabFromURL = () => {
    if (location.pathname.includes(TABS.INFOR_USER)) return TABS.INFOR_USER
    if (location.pathname.includes(TABS.HOSTEL)) return TABS.HOSTEL // Bao gồm cả URL động
    return TABS.HOSTEL
  }
  const [value, setValue] = useState(getDefaultTabFromURL())
  const handleChange = (event, selectedTab) => {
    setValue(selectedTab)
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ display: 'flex', height: 300 }}>
        {/* Tabs */}
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            width: '18%', // Cố định chiều rộng của Tabs
            flexShrink: 0 // Ngăn Tabs bị co lại
          }}
        >
          <Tab label="Quản lý thông tin người thuê " value={TABS.INFOR_USER} component={Link} to='/manage/infor-user' />
          <Tab label="Quản lý thông tin phòng trọ" value={TABS.HOSTEL} component={Link} to='/manage/hostel' />
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ flex: 1, p: 3, width: '82%' }}>
          <TabContext value={value}>
            <TabPanel value={TABS.INFOR_USER}><InforUser /></TabPanel>
            <TabPanel value={TABS.HOSTEL}>
            {location.pathname === '/manage/hostel' ? <Hostel /> : <Rooms />}
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </Container>
  )
}
export default Manage