import Bedsit from './Bedsit/Bedsit'
import { Box } from '@mui/material'

import { selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useSelector } from 'react-redux'
import Grid from '@mui/material/Grid'
function ListBedsit({rooms}) {
  const hostel = useSelector(selectCurrentActiveHostel)
  return (
    <Grid container spacing={2} sx={{ padding: '20px', gap: 2 }}>
      {rooms?.map(room => (<Bedsit key={room._id} room={room}/>))}
    </Grid>
  )
}
export default ListBedsit