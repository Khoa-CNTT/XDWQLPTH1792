import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTheme } from '@mui/material/styles'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteConversationAPI, selectCurrentConversation } from '~/redux/conversation/conversationSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { calculateTimeAgo } from '~/utils/formatters'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import { useConfirm } from 'material-ui-confirm'
import { socketIoInstance } from '~/socketClient'
const ChatSidebar = ({ conversations }) => {
  // Giúp hiển thị thanh Confirm khi click vào nút "Update hoặc xóa"
  const confirmUpdateOrDelete = useConfirm()
  const navigate = useNavigate()

  // Hiển thị tin nhắn tô đậm
  const handleNewMessageOfConversation = (conversation) => {
    return setNewMessage(conversation._id)
  }
  socketIoInstance.on('BE_USER_MESSAGE', handleNewMessageOfConversation)
  const dispatch = useDispatch()
  const theme = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const conversation = useSelector(selectCurrentConversation)
  const { conversationId } = useParams()
  // Biến state đơn giản để kiểm tra nó co thông báo mới hay không
  const [newMessage, setNewMessage] = useState(null)
  // state mở menu
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const allOtherUsers = conversations?.flatMap(conversation => {
    const { currentUser, lastMessage, _id } = conversation
    // Lọc tất cả user khác currentUser trong inforUsers của mỗi phần tử
    return conversation.inforUsers.filter(user => user._id !== currentUser).map(user => ({
      ...user,
      lastMessage: lastMessage,
      conversationId: _id
    }))
  })
  // // Lọc danh sách users dựa trên searchTerm
  const filteredUsers = allOtherUsers?.filter((user) =>
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const [selectedUser, setSelectedUser] = useState(null)

  // Xóa 1 conversation
  const deleteConversation = (conversationId) => {
    confirmUpdateOrDelete({
      title: 'Xóa hộp thoại này',
      description: 'Bạn có chắc chắn muốn xóa hộp thoại này không? (Sẽ xóa tất cả tin nhắn của bạn)',
      confirmationText: 'Có',
      cancellationText: 'Hủy'
    }).then(() => {
      dispatch(deleteConversationAPI(conversationId))
    }).catch()
  }
  return (
    <Box
      sx={{
        width: '25%',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        overflowY: 'hidden'
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white',
          height: '83px'
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 2
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Times New Roman',
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000'
            }}
          >
            Messeger Nhà Trọ
          </Typography>
          <SettingsIcon
            sx={{
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              cursor: 'pointer',
              ml: 2
            }}
          />
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />
          }}
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'hsla(224, 100.00%, 50.00%, 0.20)',
            borderRadius: 1
          }}
        />
      </Box>

      {/* Conversaation List */}
      <List
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 150px)'
        }}
      >
        <Divider
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.1)'
          }}
        />
        {filteredUsers?.map((user) => (
          <React.Fragment key={user.conversationId}>
            <ListItem
              button
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor:
                  selectedUser?.id === user.id
                    ? theme.palette.mode === 'dark'
                      ? '#333333'
                      : 'rgba(226, 222, 222, 0.41)'
                    : 'transparent',
                color: selectedUser?.id === user.id ? '' : 'inherit',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.41)'
                      : 'rgba(74, 73, 73, 0.3)',
                  '.hover-menu': {
                    display: 'block' // Hiển thị nút ba chấm khi hover
                  }
                }
              }}
              onClick={() => {
                setSelectedUser(user)
                if (conversationId === user.conversationId)
                  setNewMessage(null)
                navigate(`/home/message/${user.conversationId}`)
              }
              }
            >
              <ListItemAvatar>
                <Avatar src={user.avatar || 'user-avatar.jpg'} />
              </ListItemAvatar>
              <ListItemText
                primary={user.displayName}
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        fontWeight: newMessage === user.conversationId ? '900' : '400',
                        color: newMessage === user.conversationId ? '#444444' : 'gray'
                      }}
                    >
                      {user._id !== user?.lastMessage?.senderId && 'Bạn: '}
                      {user?.lastMessage?.content}
                    </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginLeft: 1, whiteSpace: 'nowrap' }}
                    >
                      {user?.lastMessage?.createAt
                        ? calculateTimeAgo(user?.lastMessage?.createAt)
                        : 'Không có hoạt động gần đây'}
                    </Typography>
                  </Box>
                }
              />
              {/* Nút ba chấm */}
              <IconButton
                className="hover-menu"
                sx={{
                  position: 'absolute',
                  right: 16,
                  display: 'none' // Ẩn mặc định
                }}
                id="fade-button"
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => {
                  e.stopPropagation() // Ngăn sự kiện click lan ra ngoài
                  handleClick(e)
                }}
              >
                <MoreHorizIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="fade-menu"
                MenuListProps={{
                  'aria-labelledby': 'fade-button'
                }}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  onClick={() => {
                    handleClose()
                    deleteConversation(user.conversationId)
                  }}
                  sx={{
                    padding: '4px 16px', // Giảm padding
                    minHeight: '32px', // Giảm chiều cao tối thiểu
                    fontSize: '0.875rem', // Giảm kích thước chữ (nếu cần)
                    width: '4rem'
                  }}
                >Xóa</MenuItem>
              </Menu>
            </ListItem>
            <Divider
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.1)'
              }}
            />
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}

export default ChatSidebar