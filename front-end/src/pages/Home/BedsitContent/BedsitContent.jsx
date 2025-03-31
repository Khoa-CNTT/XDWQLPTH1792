import { Box } from '@mui/material'
import ListBedsit from './ListBedsit/ListBedsit'
import Typography from '@mui/material/Typography'
import { capitalizeFirstLetter } from '~/utils/formatters'
import Divider from '@mui/material/Divider'

function BedsitContent() {
  return (
    <Box px={15} py={2} sx={{
      display: 'flex',
      flexDirection: 'column',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#F5F5F5'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      overflowY: 'auto',
      overflowX: 'auto',
      gap: 1
    }}>
      <Typography sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' :'#473C8B' )}} variant='h6'>{capitalizeFirstLetter('DANH SÁCH CÁC PHÒNG TRỌ')}</Typography>
      <Divider sx={{
        height:'2px'
      }}/>
      <ListBedsit/>
    </Box>
  )
}
export default BedsitContent