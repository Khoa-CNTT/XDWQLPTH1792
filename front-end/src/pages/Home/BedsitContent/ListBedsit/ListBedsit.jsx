import Bedsit from './Bedsit/Bedsit'
import { Box } from '@mui/material'

import { selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useSelector } from 'react-redux'

function ListBedsit({rooms}) {
  const hostel = useSelector(selectCurrentActiveHostel)
  return (
    <Box sx={{
      display: 'flex',
      flexDirection:'row',
      flexWrap: 'wrap', /* Cho phép xuống dòng khi cần */
      gap: 5.5
    }}>
      {rooms?.map(room => (<Bedsit key={room._id} room={room}/>))}
    </Box>
  )
}
export default ListBedsit