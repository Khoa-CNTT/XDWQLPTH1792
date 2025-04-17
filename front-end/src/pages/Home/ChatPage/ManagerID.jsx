import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ChatSidebar from './ChatSidebar';
import ChatPage from './ChatPage';
import AppBar from '~/components/AppBar'; // Đảm bảo đường dẫn import đúng

const initialUsers = [
  { id: 1, name: 'Nguyễn Văn A', lastMessage: 'Bạn: Tôi ni qua phòng chị nói...', time: '2 giờ trước' },
  { id: 2, name: 'Trần Thị B', lastMessage: 'Bạn: Hôm nay trời đẹp quá!', time: '1 giờ trước' },
  { id: 3, name: 'Lê Văn C', lastMessage: 'Bạn: Đã nhận được thông báo chưa?', time: '30 phút trước' },
];

const initialMessages = {
  1: [
    { text: 'Nợ 3 tháng tiền trọ rồi nha em', type: 'received' },
    { text: 'Dạ chị, em sẽ gửi sớm ạ!', type: 'sent' },
  ],
  2: [
    { text: 'Hôm nay trời đẹp quá!', type: 'received' },
    { text: 'Đúng rồi chị!', type: 'sent' },
  ],
  3: [
    { text: 'Đã nhận được thông báo chưa?', type: 'received' },
    { text: 'Em nhận được rồi ạ!', type: 'sent' },
  ],
};

const ManagerID = () => {
  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');

  // Hàm tính thời gian hiển thị
  const calculateTime = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 60000); // Tính chênh lệch phút
    if (diff === 0) return 'Vừa xong';
    if (diff === 1) return '1 phút trước';
    if (diff < 60) return `${diff} phút trước`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
  };

  // Hàm xử lý khi người dùng click vào một người dùng trong danh sách
  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

   // Hàm gửi tin nhắn
   const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      const timestamp = new Date(); // Lưu thời gian gửi tin nhắn
      const updatedMessages = {
        ...messages,
        [selectedUser.id]: [
          ...(messages[selectedUser.id] || []),
          { text: inputMessage, type: 'sent', timestamp },
        ],
      };

      // Cập nhật tin nhắn cuối cùng lastMessage cho người dùng
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? { ...user, lastMessage: inputMessage, time: calculateTime(timestamp), timestamp }
          : user
      );

      setMessages(updatedMessages);
      setUsers(updatedUsers);
      setInputMessage('');
    }
  };

  // Cập nhật thời gian hiển thị mỗi phút
  useEffect(() => {
    const interval = setInterval(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.timestamp
            ? { ...user, time: calculateTime(user.timestamp) }
            : user
        )
      );
    }, 60000); // Cập nhật mỗi phút

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
  }, []);
  
    // Xử lý xóa user
    const handleDeleteUser = (userId) => {
      setUsers(users.filter((user) => user.id !== userId)); // Xóa user
      const updatedMessages = { ...messages };
      delete updatedMessages[userId]; // Xóa tin nhắn của user
      setMessages(updatedMessages);
      setSelectedUser(users[0] || null); // Chọn user đầu tiên hoặc null
    };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* AppBar */}
      <AppBar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <ChatSidebar
          users={users}
          selectedUser={selectedUser}
          handleUserClick={handleUserClick}
          handleDeleteUser={(userId) => {
            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId)); // Xóa user khỏi danh sách
            setMessages((prevMessages) => {
              const updatedMessages = { ...prevMessages };
              delete updatedMessages[userId]; // Xóa tin nhắn của user
              return updatedMessages;
            });
            if (selectedUser?.id === userId) {
              setSelectedUser(users[0] || null); // Chọn user đầu tiên hoặc null
            }
          }}
        />
        <ChatPage
          selectedUser={selectedUser}
          messages={messages[selectedUser.id] || []}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      </Box>
    </Box>
  );
};

export default ManagerID;