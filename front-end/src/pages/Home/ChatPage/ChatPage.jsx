import React, { useState } from 'react';
import { Box, Paper, Typography, Avatar, IconButton, TextField, Button, Popover } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import WarningIcon from '@mui/icons-material/Warning';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';

const EmojiPanel = ({ onSelectEmoji }) => {
  const emojis = [
    '😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🎉', '❤️', '🔥', '✨', '🎂', '🍕', '⚽', '🏀',
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 1,
        p: 2,
        maxWidth: '300px',
      }}
    >
      {emojis.map((emoji, index) => (
        <IconButton
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          sx={{
            fontSize: '20px',
            padding: '5px',
          }}
        >
          {emoji}
        </IconButton>
      ))}
    </Box>
  );
};


const ChatPage = ({ selectedUser, messages, inputMessage, setInputMessage, handleSendMessage }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenEmojiPanel = (event) => {
    setAnchorEl(event.currentTarget); // Gán phần tử hiện tại làm anchor
  };

  const handleCloseEmojiPanel = () => {
    setAnchorEl(null); // Đặt anchor về null để đóng Popover
  };

  const handleSelectEmoji = (emoji) => {
    setInputMessage((prev) => prev + emoji); // Thêm emoji vào TextField
    handleCloseEmojiPanel(); // Đóng bảng emoji sau khi chọn
  };

  const isEmojiPanelOpen = Boolean(anchorEl); // Kiểm tra xem Popover có đang mở không

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
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
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src="user-avatar.jpg" sx={{ mr: 2 }} />
          <Box>
            <Typography variant="h6">{selectedUser.name}</Typography>
            <Typography variant="body2" color="textSecondary">
              Hoạt động {selectedUser.time}
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
      <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: message.type === 'sent' ? 'flex-end' : 'flex-start',
            }}
          >
            <Paper
              sx={{
                p: 1,
                backgroundColor:
                  message.type === 'sent'
                    ? theme.palette.mode === 'dark'
                      ? '#007bff'
                      : '#007bff'
                    : theme.palette.mode === 'dark'
                    ? '#333333'
                    : '#f0f0f0',
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
                borderRadius: 2,
                maxWidth: '60%',
              }}
            >
              {message.text}
            </Paper>
          </Box>
        ))}
      </Box>

      {/* Input */}
      <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Nhập tin nhắn..."
          variant="outlined"
          size="small"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
          sx={{ mr: 2 }}
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
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <EmojiPanel onSelectEmoji={handleSelectEmoji} />
        </Popover>
        <IconButton>
          <PhotoCameraIcon />
        </IconButton>
        <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={handleSendMessage}>
          Gửi
        </Button>
      </Paper>
    </Box>
  );
};

export default ChatPage;