import React, { useState, useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Avatar,
  Checkbox,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';

const ChatSidebar = ({ users, selectedUser, handleUserClick, handleDeleteUser }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [timeAgo, setTimeAgo] = useState({});

  // Lọc danh sách users dựa trên searchTerm
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hàm tính thời gian hiển thị
  const calculateTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 60000); // Tính chênh lệch phút
    if (diff < 1) return 'Vừa xong';
    if (diff < 60) return `${diff} phút trước`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  // Cập nhật thời gian đếm ngược cho từng user
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeAgo = {};
      users.forEach((user) => {
        if (user.lastMessageTime) {
          updatedTimeAgo[user.id] = calculateTimeAgo(user.lastMessageTime);
        }
      });
      setTimeAgo(updatedTimeAgo);
    }, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, [users]);

  // Hàm xử lý khi chọn/deselect user
  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  return (
    <Box
      sx={{
        width: '25%',
        backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#ffffff',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100vh',
        overflowY: 'hidden',
      }}
    >
      {/* Header */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : 'white',
          height: '83px',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontFamily: 'Times New Roman',
              fontWeight: 'bold',
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
            }}
          >
            Messeger Nhà Trọ
          </Typography>
          <SettingsIcon
            sx={{
              color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
              cursor: 'pointer',
              ml: 2,
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
            startAdornment: <SearchIcon sx={{ mr: 1 }} />,
          }}
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.1)'
                : 'hsla(224, 100.00%, 50.00%, 0.20)',
            borderRadius: 1,
          }}
        />
      </Box>

      {/* User List */}
      <List
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 150px)',
        }}
      >
        <Divider
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.1)',
          }}
        />
        {filteredUsers.map((user) => (
          <React.Fragment key={user.id}>
            <ListItem
              button
              onClick={() => handleUserClick(user)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor:
                  selectedUser?.id === user.id
                    ? theme.palette.mode === 'dark'
                      ? '#333333'
                      : 'rgba(100, 100, 100, 0.41)'
                    : 'transparent',
                color: selectedUser?.id === user.id ? '' : 'inherit',
                '&:hover': {
                  backgroundColor:
                    theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.41)'
                      : 'rgba(74, 73, 73, 0.3)',
                },
              }}
            >
              <Checkbox
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleCheckboxChange(user.id)}
                sx={{ mr: 2 }}
              />
              <ListItemAvatar>
                <Avatar src={user.avatar || 'user-avatar.jpg'} />
              </ListItemAvatar>
              <ListItemText
                primary={user.name}
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
        {user.lastMessage || ''}
        </Typography>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textSecondary"
                      sx={{ marginLeft: 1, whiteSpace: 'nowrap' }}
      >
        {user.time || 'Không có hoạt động gần đây'}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            <Divider
              sx={{
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(0, 0, 0, 0.1)',
              }}
            />
          </React.Fragment>
        ))}
      </List>

      {/* Delete Button */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          disabled={selectedUserIds.length === 0}
          onClick={() => {
            selectedUserIds.forEach((userId) => handleDeleteUser(userId));
            setSelectedUserIds([]);
          }}
        >
          Xóa User
        </Button>
      </Box>
    </Box>
  );
};

export default ChatSidebar;