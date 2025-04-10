import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, TextField, List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';

const ChatSidebar = ({ users, selectedUser, handleUserClick }) => {
  const [searchTerm, setSearchTerm] = useState(''); // State để lưu giá trị tìm kiếm

  // Lọc danh sách người dùng dựa trên giá trị tìm kiếm
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '25%', backgroundColor: '#007bff', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '', height: '83px' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2 }}>
        <Typography variant="h5" sx={{ fontFamily: 'Times New Roman', fontWeight: 'bold' }}>
          Messeger Nhà Trọ
        </Typography>
        <SettingsIcon sx={{ color: 'white', cursor: 'pointer', ml: 2 }} />
      </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm..."
          variant="outlined"
          size="small"
          value={searchTerm} //Giá trị của ô tìm kiếm
          onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị tìm kiếmm
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{ backgroundColor: 'white', borderRadius: 1 }}
        />
      </Box>

      {/* User List */}
      <List sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredUsers.map((user) => (
          <React.Fragment key={user.id}>
            <ListItem button selected={selectedUser?.id === user.id} onClick={() => handleUserClick(user)}>
              <ListItemAvatar>
                <Avatar src="user-avatar.jpg" />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.lastMessage} />
              <Typography variant="caption" sx={{ color: 'white' }}>
                {user.time}
              </Typography>
            </ListItem>
            <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default ChatSidebar;