import React, { useState, useEffect } from 'react';
import AppBar from '~/components/AppBar';
import {
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { field: 'id', headerName: 'ID', width: 70, align: 'center', headerAlign: 'center' },
  { field: 'room', headerName: 'Phòng', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'role', headerName: 'Vai trò', width: 90, align: 'center', headerAlign: 'center' },
  { field: 'tenant', headerName: 'Tên', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'contractDuration', headerName: 'Thời hạn hợp đồng', width: 160, align: 'center', headerAlign: 'center' },
  { field: 'startDate', headerName: 'Ngày bắt đầu', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'endDate', headerName: 'Ngày hết hạn', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'deposit', headerName: 'Tiền đặt cọc', width: 130, align: 'center', headerAlign: 'center' },
  { field: 'roomCode', headerName: 'Mã phòng', width: 100, align: 'center', headerAlign: 'center' },
  {
    field: 'actions',
    headerName: 'Hành động',
    width: 200,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 1, pt: 1.5 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
          onClick={(event) => {
            event.stopPropagation();
            handleEdit(params.row);
          }}
        >
          Chỉnh sửa
        </Button>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={(event) => {
            event.stopPropagation();
            handleDelete(params.row.id);
          }}
        >
          Xóa
        </Button>
      </Box>
    ),
  },
];

const allRows = [
  { id: 'T1', room: '101', role: 'Đã thuê' , tenant: 'Nguyễn Văn A', contractDuration: '12 tháng', startDate: '01/01/2023', endDate: '31/12/2023', deposit: '10,000,000 VND', roomCode: 'A101' },
  { id: 'T2', room: '102', role: 'Đã thuê', tenant: 'Trần Thị B', contractDuration: '6 tháng', startDate: '01/06/2023', endDate: '30/11/2023', deposit: '5,000,000 VND', roomCode: 'A102' },
  { id: 'D1', room: '103', role: 'Đã thuê', tenant: 'Lê Văn C', contractDuration: '3 tháng', startDate: '01/09/2023', endDate: '30/11/2023', deposit: '3,000,000 VND', roomCode: 'A103' },
  { id: 'D2', room: '104', role: 'Cọc', tenant: 'Phạm Thị D', contractDuration: '1 tháng', startDate: '01/10/2023', endDate: '31/10/2023', deposit: '1,000,000 VND', roomCode: 'A104' },
];

const handleEdit = (row) => {
  alert(`Chỉnh sửa hợp đồng của phòng: ${row.room}`);
};

const handleDelete = (id) => {
  alert(`Xóa hợp đồng có ID: ${id}`);
};

export default function Contracts() {
  const [contractType, setContractType] = useState('rent'); // Giá trị mặc định là "Thuê phòng"
  const [filteredRows, setFilteredRows] = useState([]);

  // Lọc dữ liệu khi giá trị contractType thay đổi
  useEffect(() => {
    if (contractType === 'rent') {
      setFilteredRows(allRows.filter((row) => row.role.startsWith('Đã thuê')));
    } else if (contractType === 'deposit') {
      setFilteredRows(allRows.filter((row) => row.role.startsWith('Cọc')));
    }
  }, [contractType]);

  const handleContractTypeChange = (event) => {
    setContractType(event.target.value);
  };

  return (
    <Box>
      <AppBar />
      <Box sx={{ pl: 10, pr: 10 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}></Box>
        <Typography variant="h5" sx={{ fontWeight: '600' }}>
          Hợp đồng thuê phòng
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup row value={contractType} onChange={handleContractTypeChange}>
            <FormControlLabel value="rent" control={<Radio />} label="Thuê phòng" />
            <FormControlLabel value="deposit" control={<Radio />} label="Đặt cọc phòng" />
          </RadioGroup>
        </FormControl>

        {/* Bảng hợp đồng */}
        <Divider sx={{ my: 2 }} />
        <Paper sx={{ height: 310, width: '100%' }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
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
            }}
          />
        </Paper>

        {/* Nút chức năng */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button variant="contained" color="error">
            Tạo hợp đồng
          </Button>
        </Box>
      </Box>
    </Box>
  );
}