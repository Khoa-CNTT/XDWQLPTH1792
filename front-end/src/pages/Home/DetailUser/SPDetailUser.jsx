import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const SPDetailUser = ({ user, onSave, onCancel, isEditing, onEdit }) => {
  const [formData, setFormData] = useState({ ...user });

  useEffect(() => {
    setFormData({ ...user }); // Cập nhật thông tin khi người dùng thay đổi
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F4EEEE'),
        borderRadius: 2,
        boxShadow: 3,
        maxWidth: 800,
        margin: 'auto',
      }}
    >
      {/* Avatar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar
          src={formData.avatar}
          sx={{ width: 100, height: 100, mr: 2 }}
        />
        <IconButton component="label" disabled={!isEditing}>
          <EditIcon />
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </IconButton>
      </Box>

      {/* Form */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Thông tin cá nhân
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Họ và tên"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="CCCD"
            name="cccd"
            value={formData.cccd || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Ngày sinh"
            name="dob"
            value={formData.dob || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Nơi cấp"
            name="issuedPlace"
            value={formData.issuedPlace || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Box>
        <FormControl sx={{ mb: 2 }}>
          <Typography>Giới tính</Typography>
          <RadioGroup
            row
            name="gender"
            value={formData.gender || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <FormControlLabel value="male" control={<Radio />} label="Nam" />
            <FormControlLabel value="female" control={<Radio />} label="Nữ" />
            <FormControlLabel value="other" control={<Radio />} label="Khác" />
          </RadioGroup>
        </FormControl>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Thông tin liên lạc
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Điện thoại"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            label="Phòng thuê"
            name="room"
            value={formData.room || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <TextField
            fullWidth
            label="Tiền phòng"
            name="rent"
            value={formData.rent || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Thông tin khác
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Thông tin thanh toán</InputLabel>
          <Select
            name="paymentInfo"
            value={formData.paymentInfo || ''}
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <MenuItem value="Kỳ">Kỳ</MenuItem>
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="20">20</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={() => onSave(formData)}
            >
              Lưu
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={onCancel}
            >
              Hủy
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Sửa
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default SPDetailUser;