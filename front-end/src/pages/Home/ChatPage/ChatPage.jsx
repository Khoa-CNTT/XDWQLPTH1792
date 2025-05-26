import { useState, useEffect } from 'react'
import { Box, Paper, Typography, Avatar, IconButton, TextField, Button, Popover } from '@mui/material'
import CallIcon from '@mui/icons-material/Call'
import WarningIcon from '@mui/icons-material/Warning'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import SendIcon from '@mui/icons-material/Send'
import { useTheme } from '@mui/material/styles'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchConversationDetailsAPI, selectCurrentConversation, updateCurrentConversation } from '~/redux/conversation/conversationSlice'
import { createNewMessaggeAPI, fetchMessagesAPI, uploadImagesAPI } from '~/apis'
import { DEFAULT_MESSAGES, DEFAULT_ITEMS_PER_MESSAGES } from '~/utils/constants'
import { useForm } from 'react-hook-form'
import CircularProgress from '@mui/material/CircularProgress'
import { singleFileValidator } from '~/utils/validators'
import { socketIoInstance } from '~/socketClient'
import { toast } from 'react-toastify'
const EmojiPanel = ({ onSelectEmoji }) => {
  const emojis = [
    '😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🎉', '❤️', '🔥', '✨', '🎂', '🍕', '⚽', '🏀'
  ]

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 1,
        p: 2,
        maxWidth: '300px'
      }}
    >
      {emojis.map((emoji, index) => (
        <IconButton
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          sx={{
            fontSize: '20px',
            padding: '5px'
          }}
        >
          {emoji}
        </IconButton>
      ))}
    </Box>
  )
}


function ChatPage({ refreshConversations }) {
  const { conversationId } = useParams()

  const dispatch = useDispatch()
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(1)
  const [messages, setMessages] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [previewUrl, setPreviewUrl] = useState(null)
  // Gọi lấy thông tin của conversation
  useEffect(() => {
    // Call API
    if (conversationId) {
      dispatch(fetchConversationDetailsAPI(conversationId))
      setOffset(1)
      setHasMore(true)
      setMessages([])
    }
    const handleReceiveMessage = (conversationFromSocket) => {
      // Cập nhật Redux với conversation mới (lastMessage, updatedAt...)
      dispatch(updateCurrentConversation(conversationFromSocket))

      // Nếu đang ở đúng cuộc trò chuyện thì fetch lại messages
      if (conversationFromSocket._id === conversationId) {
        fetchMessagesAPI(dataMessages).then(updateStateData)
      }
    }

    socketIoInstance.on('BE_USER_MESSAGE', handleReceiveMessage)

    return () => {
      if (socketIoInstance)
        socketIoInstance.off('BE_USER_MESSAGE', handleReceiveMessage)
    }
  }, [dispatch, conversationId])
  // API lấy danh sách tin nhắn ban đầu
  const dataMessages = {
    conversationId: conversationId,
    limit: DEFAULT_ITEMS_PER_MESSAGES,
    offset: '1'
  }
  useEffect(() => {
    if (!isLoading) {
      fetchMessagesAPI(dataMessages).then(updateStateData)
    }
  }, [conversationId, offset])
  const conversation = useSelector(selectCurrentConversation)

  const updateStateData = (res) => {
    setMessages(res.messages?.reverse() || [])
  }
  // API gởi tin nhắn
  const sentMessage = async (data) => {
    if (!data?.content) return
    if (data?.content && typeof data.content === 'string') {
      data.content = data.content.trim()
    }
    // Dữ liệu gơi tin nhắn
    const dataSent = {
      ...data,
      conversationId: conversationId
    }
    const result = await createNewMessaggeAPI(dataSent)
    socketIoInstance.emit('FE_USER_MESSAGE', result)
    dispatch(updateCurrentConversation(result))
    fetchMessagesAPI(dataMessages).then(updateStateData)
    reset({ content: '' })
    setPreviewUrl(null)
    setOffset(1)
    setHasMore(true)

    // Gọi hàm refreshConversations để làm mới danh sách cuộc trò chuyện
    if (refreshConversations) {
      refreshConversations(conversation)
    }
  }

  const isImageUrl = (url) => {
    return typeof url === 'string' && url.match(/\.(jpeg|jpg|gif|png|webp)$/i)
  }
  // Hiển thị tin nhắn sau khi gởi

  const otherUserConversation = conversation?.inforUsers?.filter(user => user._id !== conversation.currentUser)[0]
  const handleOpenEmojiPanel = (event) => {
    setAnchorEl(event.currentTarget) // Gán phần tử hiện tại làm anchor
  }
  const handleCloseEmojiPanel = () => {
    setAnchorEl(null) // Đặt anchor về null để đóng Popover
  }

  const isEmojiPanelOpen = Boolean(anchorEl) // Kiểm tra xem Popover có đang mở không

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm()

  const loadMoreMessages = async () => {
    if (isLoading || !hasMore) return // Ngăn việc gọi API nhiều lần
    setIsLoading(true)

    try {
      const newOffset = offset + 1
      setOffset(newOffset)
      const dataMessagesWithNewOffset = {
        ...dataMessages,
        offset: `${newOffset}`
      }
      const result = await fetchMessagesAPI(dataMessagesWithNewOffset)
      if (result.messages?.length > 0) {
        const newMessages = result.messages.reverse().concat(messages)
        setMessages(newMessages) // Thêm tin nhắn cũ vào đầu danh sách
      } else {
        setHasMore(false) // Không còn tin nhắn để tải
      }
    } finally {
      setIsLoading(false)
    }
  }
  // Thanh kéo
  const handleScroll = (event) => {
    const { scrollTop } = event.target
    if (scrollTop === 0) {
      loadMoreMessages() // Gọi hàm tải thêm tin nhắn
    }
  }
  const uploadAvatar = async (e) => {
    // Lấy file thông qua e.target?.files[0] và validate nó trước khi xử lý
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      return
    }
    // Sử dụng FormData để xử lý dữ liệu liên quan tới file khi gọi API
    let reqData = new FormData()
    reqData.append('images', e.target?.files[0])
    // Gọi API...
    const promise = await uploadImagesAPI(reqData)

    // Đoạn này kiểm tra không có lỗi (update thành công) mới thực hiện các hành động cần thiết
    // Lưu ý, dù có lỗi hoặc thành công thì cũng phải clear giá trị của file input, nếu không thì sẽ không thể chọn cùng 1 file liên
    //tiếp được
    const url = `${promise}`
    setPreviewUrl(url)
    setValue('content', url)
    e.target.value = ''
  }
  return (
    <>
      {!conversationId ?
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default'
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            Hãy chọn hộp thoại bạn muốn chat
          </Typography>
        </Box>
        :
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
            color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            height: (theme) => theme.trello.messageHeight
          }}
        >
          {/* Header */}
          <Paper
            elevation={1}
            sx={{
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={otherUserConversation?.avatar} sx={{ mr: 2 }} />
              <Box>
                <Typography variant="h6">{otherUserConversation?.displayName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Hoạt động
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton>
                <CallIcon />
              </IconButton>
              <IconButton>
                <WarningIcon />
              </IconButton>
            </Box>
          </Paper>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }} onScroll={handleScroll}>
            {isLoading &&
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <CircularProgress size={40} /> {/* size có thể là 20, 30, 40 tuỳ ý */}
              </Box>}
            {messages?.map((message, index) => (
              <Box
                key={message._id}
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: message?.senderId === conversation.currentUser ? 'flex-end' : 'flex-start'
                }}
              >
                <Paper
                  sx={{
                    p: isImageUrl(message?.content) ? 0 : 1,
                    backgroundColor:
                      message?.senderId === conversation.currentUser
                        ? theme.palette.mode === 'dark'
                          ? '#007bff'
                          : '#007bff'
                        : theme.palette.mode === 'dark'
                          ? '#333333'
                          : '#f0f0f0',
                    color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                    borderRadius: 2,
                    maxWidth: '60%'
                  }}
                >
                  {
                    isImageUrl(message?.content)
                      ? <Box
                        component="img"
                        src={message.content}
                        alt="Hình ảnh"
                        sx={{
                          display: 'block',
                          maxWidth: '100%',
                          maxHeight: 150,// giới hạn chiều cao ảnh
                          borderRadius: 1,
                          objectFit: 'cover'
                        }}
                      />
                      : <Box
                        sx={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word'
                        }}
                      >
                        {message?.content}
                      </Box>
                  }
                </Paper>
              </Box>
            ))}

          </Box>

          {/* Input */}
          <form onSubmit={handleSubmit(sentMessage)}>
            <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              {/* Hiển thị ảnh preview */}
              {previewUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <Box
                    component="img"
                    src={previewUrl}
                    alt="Ảnh đã chọn"
                    sx={{
                      width: 150,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid #ccc'
                    }}
                  />
                  <IconButton
                    aria-label="xóa ảnh"
                    onClick={() => setPreviewUrl('')}
                    size="small"
                    sx={{ ml: 0.5 }}
                  >
                    ✕
                  </IconButton>
                </Box>
              )}
              <TextField
                fullWidth
                placeholder="Nhập tin nhắn..."
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
                {...register('content')}
              />
              <IconButton onClick={handleOpenEmojiPanel}>
                <EmojiEmotionsIcon />
              </IconButton>
              <Popover
                open={isEmojiPanelOpen}
                anchorEl={anchorEl}
                onClose={handleCloseEmojiPanel}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center'
                }}
              >
                <EmojiPanel />
              </Popover>
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
              >
                <PhotoCameraIcon />
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0]
                    uploadAvatar(e)
                  }}
                />
              </IconButton>
              <Button variant="contained" color="primary" endIcon={<SendIcon />} type='submit' >
                Gửi
              </Button>
            </Paper>
          </form>
        </Box>
      }
    </>
  )
}

export default ChatPage