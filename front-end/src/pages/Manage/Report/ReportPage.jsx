import { useState } from 'react'
import {
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
} from '@mui/material'
import BarChartIcon from '@mui/icons-material/BarChart'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import FlashOnIcon from '@mui/icons-material/FlashOn'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import EventNoteIcon from '@mui/icons-material/EventNote'

// Report tab content components (bạn xây thêm)
import OverviewReport from './OverviewReport'
import RevenueReport from './RevenueReport'
import UtilityReport from './UtilityReport'
import TenantReport from './TenantReport'
import RoomReport from './RoomReport'

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const tabList = [
  { label: 'Tổng Quan', icon: <BarChartIcon />, component: <OverviewReport/> },
  { label: 'Doanh Thu', icon: <AttachMoneyIcon />, component: <RevenueReport/> },
  { label: 'Điện - Nước', icon: <FlashOnIcon />, component: <UtilityReport/> },
  { label: 'Khách Trọ', icon: <PeopleAltIcon />, component: <TenantReport/> },
  { label: 'Phòng', icon: <HomeWorkIcon />, component: <RoomReport/> }
]

export default function ReportPage() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue)
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3, background: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5') }}>
      <Typography variant="h4" fontWeight={700} mb={2} color="primary">
        📈 Báo Cáo & Thống Kê Nhà Trọ
      </Typography>

      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            fontSize: 16,
            gap: 1,
            px: 2,
          },
        }}
      >
        {tabList.map((tab, index) => (
          <Tab key={index} icon={tab.icon} label={tab.label} iconPosition="start" />
        ))}
      </Tabs>

      {tabList.map((tab, index) => (
        <TabPanel key={index} value={currentTab} index={index} sx={{background: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : 'linear-gradient(to right, #e0f7fa, #ffffff)')}}>
          {tab.component}
        </TabPanel>
      ))}
    </Paper>
  )
}
