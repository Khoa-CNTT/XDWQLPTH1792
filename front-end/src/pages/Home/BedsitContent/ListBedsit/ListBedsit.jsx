import Bedsit from './Bedsit/Bedsit'
import { Box } from '@mui/material'

import { selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useSelector } from 'react-redux'
function ListBedsit() {
  const hostel = useSelector(selectCurrentActiveHostel)
  return (
    <Box sx={{
      display: 'flex',
      flexDirection:'row',
      flexWrap: 'wrap', /* Cho phép xuống dòng khi cần */
      gap: 5.5
    }}>

    </Box>
  )
}
export default ListBedsit