import React from 'react';
import { Box, Paper, Typography, Avatar, IconButton, TextField, Button } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import WarningIcon from '@mui/icons-material/Warning';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SendIcon from '@mui/icons-material/Send';

const ChatPage = ({ selectedUser, messages, inputMessage, setInputMessage, handleSendMessage }) => {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                backgroundColor: message.type === 'sent' ? '#007bff' : '#f0f0f0',
                color: message.type === 'sent' ? 'white' : 'black',
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
        <IconButton>
          <EmojiEmotionsIcon />
        </IconButton>
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