import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import ChatSidebar from './ChatSidebar'
import ChatPage from './ChatPage'
import AppBar from '~/components/AppBar' // Đảm bảo đường dẫn import đúng
import { fetchConversationsAPI } from '~/apis'
import { socketIoInstance } from '~/socketClient'
function ManagerID() {
  const [conversations, setConversations] = useState(null)

  const refreshConversations = () => {
    fetchConversationsAPI().then((res) => setConversations(res))
  }
  useEffect(() => {
    fetchConversationsAPI().then( res => setConversations(res)
    )
  }, [])
  socketIoInstance.on('BE_USER_MESSAGE', refreshConversations)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* AppBar */}
      <AppBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <ChatSidebar conversations={conversations}
        />
        <ChatPage refreshConversations={refreshConversations}
        />
      </Box>
    </Box>
  )
}

export default ManagerID