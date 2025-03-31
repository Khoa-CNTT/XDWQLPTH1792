
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { Box } from '@mui/material'
import { capitalizeFirstLetter } from '~/utils/formatters'
import Button from '@mui/material/Button'
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
  { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const paginationModel = { page: 0, pageSize: 10 };
function InforUser() {
  return (
    <>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 1
      }}>
        < Box>
          <Typography sx={{ color: '#473C8B' }} variant='h6'>{capitalizeFirstLetter('DANH SÁCH CÁC NGƯỜI THUÊ')}</Typography>
        </Box>
        < Box sx={{
          display: 'flex',
          gap: 1
        }}>
          <Button variant='contained' color='success'>
            Mời thành viên
          </Button>
          <Button variant='outlined' color='error' sx={{
            borderWidth: '2px'
          }}>
            Xóa thành viên
          </Button>
        </Box>

      </Box>
      <Divider sx={{
        height: '2px'
      }} />
      <Paper sx={{ height: 510, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection // checkbox vẫn hoạt động bình thường
          sx={{ border: 0, cursor: 'pointer' }}
          disableRowSelectionOnClick // để tránh chọn hàng khi bấm vào bất kỳ đâu ngoài checkbox.
          onRowClick={(params, event) => {
            // Kiểm tra nếu bấm vào checkbox thì không chạy sự kiện khác
            if (event.target.closest('.MuiDataGrid-cellCheckbox')) {
              return;
            }
            alert(`Bạn đã nhấn vào hàng có ID: ${params.id}`);
          }}
        />
      </Paper>
    </>
  )
}
export default InforUser