import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import UploadIcon from '@mui/icons-material/Upload';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import AppBar from '~/components/AppBar';

const DetailRoom = () => {
  const { id } = useParams(); // Lấy id phòng từ URL
  const navigate = useNavigate(); // Điều hướng quay lại trang trước
  const location = useLocation(); // Lấy thông tin trạng thái từ điều hướng
  const isNewRoom = location.pathname === '/room/new'; // Kiểm tra nếu là thêm phòng mới

  const [formData, setFormData] = useState(
    isNewRoom
      ? {
          name: '',
          location: '',
          price: '',
          area: '',
          furniture: 'Không',
          type: 'Thường',
          tenant: '',
          status: 'Trống',
          images: [],
        }
      : null
  );

  const [isEditing, setIsEditing] = useState(isNewRoom); // Trạng thái chỉnh sửa (mặc định là true nếu thêm mới)
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Ảnh hiện tại

  useEffect(() => {
    if (!isNewRoom && id) {
      fetchRoomData(id); // Lấy dữ liệu phòng khi không phải thêm mới
    }
  }, [id, isNewRoom]);

  // Giả lập dữ liệu từ cơ sở dữ liệu
  const fetchRoomData = async (roomId) => {
    const data = [
      {
        id: 1,
        name: 'Phòng 1001',
        location: 'Tầng 1',
        price: '3000000',
        area: '25',
        furniture: 'Có',
        type: 'Thường',
        tenant: 'Nguyễn Văn A',
        status: 'Đã thuê',
        images: ['front-end/src/assets/Test.jpg'],
      },
      {
        id: 2,
        name: 'Phòng 1002',
        location: 'Tầng 2',
        price: '4000000',
        area: '30',
        furniture: 'Không',
        type: 'Cao cấp',
        tenant: '',
        status: 'Trống',
        images: ['front-end/src/assets/Test.jpg'],
      },
    ];

    const room = data.find((room) => room.id === parseInt(roomId));
    if (room) {
      setFormData(room);
    }
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chuyển ảnh
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? formData.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === formData.images.length - 1 ? 0 : prev + 1));
  };

  // Xử lý upload ảnh
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý lưu
  const handleSave = () => {
    console.log('Dữ liệu đã lưu:', formData);
    navigate(-1, { state: { newRoom: formData } }); // Quay lại RoomStatus.jsx và truyền dữ liệu phòng mới
  };

  // Xử lý chuyển sang trạng thái chỉnh sửa
  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!formData) {
    return <Typography>Đang tải dữ liệu...</Typography>;
  }

  return (
    <Box>
      <AppBar/> 
      <Box sx={{ p: 3 }}>
        {/* Thông tin phòng */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {isNewRoom ? 'Thêm phòng mới' : formData.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            bgcolor: '#f9f9f9',
          }}
        >
          {/* Form thông tin */}
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Vị trí"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing} // Chỉ cho phép chỉnh sửa khi ở trạng thái chỉnh sửa
              />
              <TextField
                label="Giá tiền"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  endAdornment: <Typography>VND</Typography>,
                }}
                disabled={!isEditing}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Diện tích"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  endAdornment: <Typography>m²</Typography>,
                }}
                disabled={!isEditing}
              />
              <TextField
                label="Tên người thuê"
                name="tenant"
                value={formData.tenant || ''}
                onChange={handleInputChange}
                fullWidth
                disabled={!isEditing}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                sx={{ width: '48%' }}
                disabled={!isEditing}
              >
                <MenuItem value="Thường">Thường</MenuItem>
                <MenuItem value="Cao cấp">Cao cấp</MenuItem>
              </Select>
              <TextField
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                sx={{ width: '48%' }}
                disabled={!isEditing}
              />
            </Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Nội thất
            </Typography>
            <RadioGroup
              row
              name="furniture"
              value={formData.furniture}
              onChange={handleInputChange}
              disabled={!isEditing}
            >
              <FormControlLabel value="Có" control={<Radio />} label="Có" />
              <FormControlLabel value="Không" control={<Radio />} label="Không" />
            </RadioGroup>
          </Box>

          {/* Ảnh phòng */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton onClick={handlePrevImage} disabled={!isEditing}>
              <ArrowBackIosIcon />
            </IconButton>
            <Box
              component="img"
              src={formData.images[currentImageIndex]}
              alt="Room"
              sx={{
                width: '400',
                height: '300',
                maxHeight: 300,
                minWidth: 400,
                minHeight: 300,
                maxWidth: 400,
                objectFit: 'cover',
                borderRadius: 2,
                mb: 1,
              }}
            />
            <IconButton onClick={handleNextImage} disabled={!isEditing}>
              <ArrowForwardIosIcon />
            </IconButton>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
              sx={{ mt: 2 }}
              disabled={!isEditing}
            >
              Upload ảnh
              <input type="file" hidden onChange={handleUploadImage} />
            </Button>
          </Box>
        </Box>

        {/* Nút hành động */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          {!isEditing && !isNewRoom && (
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Chỉnh sửa
            </Button>
          )}
          {isEditing && (
            <Button variant="contained" color="primary" onClick={handleSave}>
              Lưu
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DetailRoom;