import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  TextField,
  Grid,
  Divider,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useNavigate } from 'react-router-dom';
import AppBar from '~/components/AppBar';

const RoomStatus = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState(['Tất cả', 'Thường', 'Cao cấp']);
  const [selectedRoomType, setSelectedRoomType] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCount, setAvailableCount] = useState(0);
  const [rentedCount, setRentedCount] = useState(0);

  
  useEffect(() => {
    const fetchRooms = async () => {
      const data = [
        { id: 1, name: 'Phòng 101', type: 'Thường', status: 'Đã thuê', tenant: 'Nguyễn Văn A', price: 3000000 },
        { id: 2, name: 'Phòng 102', type: 'Thường', status: 'Trống', tenant: '', price: 2000000 },
        { id: 3, name: 'Phòng 103', type: 'Cao cấp', status: 'Đã thuê', tenant: 'Trần Văn B', price: 5000000 },
        { id: 4, name: 'Phòng 104', type: 'Cao cấp', status: 'Trống', tenant: '', price: 7000000 },
      ];
      setRooms(data);
      setFilteredRooms(data);
      calculateCounts(data);
    };

    fetchRooms();
  }, []);

  const calculateCounts = (rooms) => {
    const available = rooms.filter((room) => room.status === 'Trống').length;
    const rented = rooms.filter((room) => room.status === 'Đã thuê').length;
    setAvailableCount(available);
    setRentedCount(rented);
  };

  useEffect(() => {
    let filtered = rooms;

    if (selectedRoomType !== 'Tất cả') {
      filtered = filtered.filter((room) => room.type === selectedRoomType);
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      filtered = filtered.filter((room) => room.price >= minPrice && room.price <= maxPrice);
    }

    if (statusFilter) {
      filtered = filtered.filter((room) => room.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (room) =>
          room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          room.type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredRooms(filtered);
    calculateCounts(filtered);
  }, [rooms, selectedRoomType, priceRange, statusFilter, searchQuery]);

  const handleRoomTypeChange = (event) => {
    setSelectedRoomType(event.target.value);
  };

  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleViewRoom = (id) => {
    navigate(`/room/${id}`);
  };

  const handleDeleteRoom = (id) => {
    const updatedRooms = rooms.filter((room) => room.id !== id);
    setRooms(updatedRooms);
    setFilteredRooms(updatedRooms);
    calculateCounts(updatedRooms);
  };

  const handleAddRoom = () => {
    navigate('/room/new'); // Điều hướng đến trang thêm phòng
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar />
      <Box sx={{ p: 3, flex: 1 }}>
        {/* Bộ lọc */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="subtitle1">Loại phòng</Typography>
            <Select
              value={selectedRoomType}
              onChange={handleRoomTypeChange}
              displayEmpty
              IconComponent={ArrowDropDownIcon}
              sx={{ width: 150 }}
            >
              {roomTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <Typography variant="subtitle1">Mức giá</Typography>
            <Select
              value={priceRange}
              onChange={handlePriceRangeChange}
              displayEmpty
              IconComponent={ArrowDropDownIcon}
              sx={{ width: 200 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="2000000-3000000">2.000.000 - 3.000.000</MenuItem>
              <MenuItem value="3000001-5000000">3.000.000 - 5.000.000</MenuItem>
              <MenuItem value="5000001-7000000">5.000.000 - 7.000.000</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography variant="subtitle1">Trạng thái</Typography>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              displayEmpty
              IconComponent={ArrowDropDownIcon}
              sx={{ width: 150 }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Trống">Còn trống</MenuItem>
              <MenuItem value="Đã thuê">Đã thuê</MenuItem>
            </Select>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">Tìm kiếm</Typography>
            <TextField
              placeholder="Nhập tên phòng hoặc loại phòng"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6">Còn trống: {availableCount}</Typography>
          <Typography variant="h6">Đã thuê: {rentedCount}</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {filteredRooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  boxShadow: 1,
                  bgcolor: room.status === 'Trống' ? '#e8f5e9' : '#ffebee',
                }}
              >
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="subtitle1">
                  {room.status === 'Trống' ? 'Trống' : `Người thuê: ${room.tenant}`}
                </Typography>
                <Typography variant="subtitle1">
                  Giá: {room.price.toLocaleString()} VND
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  {room.status === 'Trống' ? (
                    <Button variant="contained" color="success">
                      Thêm khách
                    </Button>
                  ) : null}
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewRoom(room.id)}
                  >
                    Xem
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Xóa
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          p: 2,
          bgcolor: 'white',
          borderTop: '1px solid #ccc',
          textAlign: 'center',
        }}
      >
        <Button variant="contained" color="primary" onClick={handleAddRoom}>
          Thêm phòng
        </Button>
      </Box>
    </Box>
  );
};

export default RoomStatus;