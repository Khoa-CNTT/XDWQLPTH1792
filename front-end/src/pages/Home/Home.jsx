import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BedsitBar from './BedsitBar/BedsitBar'
import BedsitContent from './BedsitContent/BedsitContent'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// import { fetchHostelDetailsAPI } from '~/apis'
import { fetchHostelDetailsAPI, updateCurrentActiveHostel, selectCurrentActiveHostel } from '~/redux/activeHostel/activeHostelSlice'
import { useDispatch, useSelector } from 'react-redux'
function Home() {

  const dispatch = useDispatch()
  // const [hostel, setHostel] = useState(null)
  const hostel = useSelector(selectCurrentActiveHostel)
  const { hostelId } = useParams()
  console.log( hostelId)
  useEffect(() => {
    // const hostelId = '67e35e0682e1a9ceb069ce6c'
    // Call API
    dispatch(fetchHostelDetailsAPI(hostelId))
  }, [dispatch, hostelId])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar/>
      <BedsitBar/>
      <BedsitContent/>
    </Container>
  )
}
export default Home