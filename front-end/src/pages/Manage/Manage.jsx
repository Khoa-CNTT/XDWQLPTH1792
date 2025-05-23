import { useState } from 'react'
import AppBar from '~/components/AppBar'
import { Link, useLocation } from 'react-router-dom'
import Hostel from './Hostel/Hostels'
import InforUser from './InforUser/InforUser'
import Container from '@mui/material/Container'
import GiteOutlinedIcon from '@mui/icons-material/GiteOutlined'

//Tab
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import Rooms from './Rooms/Rooms'
import Contracts from './Contracts/Contracts'
import Utility from './Utility/Utility'
import Accounts from './Accounts/Accounts'
import Bills from './Bills/Bills'
import FacilityPage from './FacilityPage/FacilityPage'
// import Report from './Report/Report'
import ReportPage from './Report/ReportPage'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { USER_ROLES } from '~/utils/constants'
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined'
import GroupsIcon from '@mui/icons-material/Groups'
import GavelIcon from '@mui/icons-material/Gavel'
import DescriptionIcon from '@mui/icons-material/Description'
import BarChartIcon from '@mui/icons-material/BarChart'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import Requets from './Request/Requets'
import HandymanIcon from '@mui/icons-material/Handyman'
const TABS = {
  INFOR_USER: 'infor-user',
  HOSTEL: 'hostel',
  CONTRACTS: 'contracts',
  UTILITY: 'utility',
  ACCOUNTS: 'accounts',
  BILLS: 'bills',
  REPORTS: 'reports',
  FACILITY: 'facility',
  REQUEST:'request'
}
function Manage() {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()
  const getDefaultTabFromURL = () => {
    if (location.pathname.includes(TABS.INFOR_USER)) return TABS.INFOR_USER
    if (location.pathname.includes(TABS.HOSTEL)) return TABS.HOSTEL // Bao gồm cả URL động
    if (location.pathname.includes(TABS.CONTRACTS)) return TABS.CONTRACTS // Bao gồm cả URL động
    if (location.pathname.includes(TABS.UTILITY)) return TABS.UTILITY // Bao gồm cả URL động
    if (location.pathname.includes(TABS.ACCOUNTS)) return TABS.ACCOUNTS // Bao gồm cả URL động
    if (location.pathname.includes(TABS.BILLS)) return TABS.BILLS // Bao gồm cả URL động
    if (location.pathname.includes(TABS.REPORTS)) return TABS.REPORTS // Bao gồm cả URL động
    if (location.pathname.includes(TABS.FACILITY)) return TABS.FACILITY // Bao gồm cả URL động
    if (location.pathname.includes(TABS.REQUEST)) return TABS.REQUEST // Bao gồm cả URL động
    return TABS.HOSTEL
  }
  const [value, setValue] = useState(getDefaultTabFromURL())
  const handleChange = (event, selectedTab) => {
    setValue(selectedTab)
  }
  const tabStyles = {
    justifyContent: 'flex-start', // Đẩy toàn bộ nội dung về trái
    '& .MuiTab-iconWrapper': {
      minWidth: '30px', // Đảm bảo icon không chiếm nhiều không gian
      marginRight: 2 // Khoảng cách giữa icon và label
    },
    '& .MuiTab-wrapper': {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1 // Giữ khoảng cách nhỏ
    }
  }
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ display: 'flex', height: '100%' }}>
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
          <Tab label="Quản lý thông tin người thuê" sx={tabStyles} icon={<GroupsIcon />} iconPosition="start" value={TABS.INFOR_USER} component={Link} to='/manage/infor-user' />
          <Tab label="Quản lý thông tin phòng trọ" sx={tabStyles} icon={<GiteOutlinedIcon />} iconPosition="start" value={TABS.HOSTEL} component={Link} to='/manage/hostel' />
          <Tab label="Quản lý hợp đồng phòng trọ" sx={tabStyles} icon={<GavelIcon />} iconPosition="start" value={TABS.CONTRACTS} component={Link} to='/manage/contracts' />
          <Tab label="Quản lý tiện ích nhà trọ" sx={tabStyles} icon={<WaterDropOutlinedIcon />} iconPosition="start" value={TABS.UTILITY} component={Link} to='/manage/utility' />
          <Tab label="Quản lý hóa đơn nhà trọ" sx={tabStyles} icon={<DescriptionIcon />} iconPosition="start" value={TABS.BILLS} component={Link} to='/manage/bills' />
          <Tab label="Thống kê báo cáo" sx={tabStyles} icon={<BarChartIcon />} iconPosition="start" value={TABS.REPORTS} component={Link} to='/manage/reports' />
          <Tab label="Quản lý tình trạng cơ sở vật chất" sx={tabStyles} icon={<AcUnitIcon />} iconPosition="start" value={TABS.FACILITY} component={Link} to='/manage/facility' />
          <Tab label="Yêu cầu sữa chữa" sx={tabStyles} icon={<HandymanIcon />} iconPosition="start" value={TABS.REQUEST} component={Link} to='/manage/request' />
          {user.role === USER_ROLES.ADMIN &&
            < Tab label="Quản lý tài khoản" sx={tabStyles} icon={<SupervisorAccountIcon />} iconPosition="start" value={TABS.ACCOUNTS} component={Link} to='/manage/accounts' />
          }
        </Tabs>

        {/* Tab Panels */}
        <Box sx={{ flex: 1, p: 3, width: '82%' }}>
          <TabContext value={value}>
            <TabPanel value={TABS.INFOR_USER}><InforUser /></TabPanel>
            <TabPanel value={TABS.CONTRACTS}><Contracts /></TabPanel>
            <TabPanel value={TABS.UTILITY}><Utility /></TabPanel>
            <TabPanel value={TABS.BILLS}><Bills /></TabPanel>
            <TabPanel value={TABS.REPORTS}><ReportPage /></TabPanel>
            <TabPanel value={TABS.FACILITY}><FacilityPage /></TabPanel>
            <TabPanel value={TABS.REQUEST}><Requets /></TabPanel>
            {user.role === USER_ROLES.ADMIN &&
              <TabPanel value={TABS.ACCOUNTS}><Accounts /></TabPanel>
            }
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