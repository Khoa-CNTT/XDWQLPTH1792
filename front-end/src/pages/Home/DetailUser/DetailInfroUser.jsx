import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Typography, Divider, Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AppBar from '~/components/AppBar';
import SPDetailUser from './SPDetailUser';

const DetailInforUser = () => {
  const [userRows, setUserRows] = useState([
    { id: 1, name: 'Nguyễn Văn A', cccd: '123456789', room: '1001' },
    { id: 2, name: 'Nguyễn Văn B', cccd: '987654321', room: '1002' },
    { id: 3, name: 'Trần Thị C', cccd: '456789123', room: '1003' },
  ]);

  const [isAdding, setIsAdding] = useState(false); // Trạng thái hiển thị bảng điền thông tin
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn

  const handleAddUser = () => {
    setIsAdding(true); // Hiển thị bảng điền thông tin
    setIsEditing(true); // Mở khóa các ô thông tin
    setSelectedUser({}); // Reset dữ liệu người dùng mới
  };

  const handleSaveUser = (user) => {
    if (user.id) {
      // Cập nhật thông tin người dùng
      setUserRows((prevRows) =>
        prevRows.map((row) => (row.id === user.id ? { ...row, ...user } : row))
      );
    } else {
      // Thêm người dùng mới
      setUserRows((prevRows) => [...prevRows, { id: prevRows.length + 1, ...user }]);
    }
    setIsAdding(false); // Thu bảng lại
    setIsEditing(false); // Khóa các ô thông tin
    setSelectedUser(null); // Xóa người dùng được chọn
  };

  const handleCancelAdd = () => {
    setIsAdding(false); // Thu bảng lại
    setIsEditing(false); // Khóa các ô thông tin
    setSelectedUser(null); // Xóa người dùng được chọn
  };

  const handleDeleteUser = (id) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa người dùng?`);
    if (confirmDelete) {
      setUserRows((prevRows) => prevRows.filter((row) => row.id !== id));
      alert(`Đã xóa khỏi nhà`);
    }
  };

  const handleViewUser = (id) => {
    const user = userRows.find((row) => row.id === id);
    setSelectedUser(user); // Truyền thông tin người dùng vào bảng
    setIsAdding(true); // Hiển thị bảng điền thông tin
    setIsEditing(false); // Khóa các ô thông tin
  };

  const handleEditUser = () => {
    setIsEditing(true); // Mở khóa các ô thông tin
  };

  const columns = [
    { field: 'id', headerName: 'STT', width: 70 ,headerClassName: 'custom-header',cellClassName: 'custom-cell'},
    { field: 'name', headerName: 'Tên', width: 200 ,headerClassName: 'custom-header',cellClassName: 'custom-cell'},
    { field: 'cccd', headerName: 'CCCD', width: 150 ,headerClassName: 'custom-header',cellClassName: 'custom-cell'},
    { field: 'room', headerName: 'Phòng thuê', width: 120 ,headerClassName: 'custom-header',cellClassName: 'custom-cell'},
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      headerClassName: 'custom-header',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center',width: '100%' }}>
          <IconButton
            color="primary"
            onClick={() => handleViewUser(params.row.id)}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteUser(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <AppBar title="Danh sách người dùng" />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          pl: 29,
          pr: 14,
          mt: 2,
        }}
      >
        <Typography sx={{ color: '#473C8B' }} variant="h6">
          Tổng: {userRows.length} người
        </Typography>
        <Button variant="contained" color="success" onClick={handleAddUser}>
          Thêm
        </Button>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center',}}>
        {/* Bảng danh sách người dùng */}
        <Divider sx={{ height: '2px', width: isAdding ? 'auto' : 'auto'}} />
        <Paper sx={{ height: 510, width: isAdding ? 'auto' : 'auto' }}>
          <DataGrid
            rows={userRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            disableSelectionOnClick
            sx={{
              border: 0,
              cursor: 'pointer',
              '& .MuiDataGrid-cell:focus': {
                outline: 'none',
              },
              '& .MuiDataGrid-cell:focus-within': {
                outline: 'none',
              },
              '& .custom-header': {
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#378fe5'), // Màu nền tiêu đề
                color: '#ffffff', // Màu chữ tiêu đề
                fontWeight: 'bold',
              },
            }}
          />
        </Paper>

        {/* Bảng điền thông tin */}
        {isAdding && (
          <Box sx={{ width: '40%' }}>
            <SPDetailUser
              user={selectedUser || {}} // Truyền thông tin người dùng hoặc dữ liệu trống
              onSave={handleSaveUser}
              onCancel={handleCancelAdd}
              isEditing={isEditing} // Truyền trạng thái chỉnh sửa
              onEdit={handleEditUser} // Hàm mở khóa các ô thông tin
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DetailInforUser;