import React, { useEffect, useState } from 'react'
import {
  Box, Card, CardContent, Typography, List, ListItem, ListItemText,
  Avatar, Divider, Chip, Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import {
  fetchRequestDetailsAPI,
  selectCurrentActiveRequest
} from '~/redux/repairRequest/repairRequestsSlice'
import { fetchHostelsByOwnerIdAPI, fetchRequestByHostelId, updateRequestAPI } from '~/apis'
import { REQUETS_STATUS } from '~/utils/constants'
const Requests = () => {
  const dispatch = useDispatch()
  const [selectedHostelId, setSelectedHostelId] = useState('')
  const [refesh, setRefesh] = useState(false)
  const [filteredRequests, setFilteredRequests] = useState('')
  const [hostels, setHostels] = useState([])

  useEffect(() => {
    dispatch(fetchRequestDetailsAPI())
    fetchHostelsByOwnerIdAPI().then(res => {
      setHostels(res || [])
      if (res.length > 0) {
        setSelectedHostelId(res[0]._id) // Đặt nhà trọ đầu tiên làm mặc định
      }
    })
  }, [dispatch])
  useEffect(() => {
    if (selectedHostelId) {
      fetchRequestByHostelId({ hostelId: selectedHostelId }).then(res => setFilteredRequests(res))
    }
  }, [selectedHostelId, refesh])

  const updateRequest = (status, requestId) => {
    const data = { status }
    console.log('data', data)
    updateRequestAPI(requestId, data).then(res => {
      if (!res.error)
        setRefesh(prev => !prev)
    })
  }
  return (
    <>
      <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
        <Typography variant="h4" fontWeight={800} gutterBottom color="primary">
          📋 Yêu cầu sửa chữa
        </Typography>

        <FormControl fullWidth sx={{ my: 2 }}>
          <InputLabel>Chọn nhà trọ</InputLabel>
          <Select
            value={selectedHostelId}
            onChange={(e) => setSelectedHostelId(e.target.value)}
            label="Chọn nhà trọ"
          >
            {hostels.map((hostel) => (
              <MenuItem key={hostel._id} value={hostel._id}>
                {hostel.hostelName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {filteredRequests.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" mt={4}>
            Không có yêu cầu phù hợp.
          </Typography>
        ) : (
          <Card
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            sx={{ borderRadius: 4, boxShadow: 6, p: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#fffff' : '#fff') }}
          >
            <CardContent>
              <Box sx={{ maxHeight: 500, overflowY: 'auto', pr: 1 }}>
                <List >
                  {filteredRequests.reverse().map((req, index) => (
                    <React.Fragment key={req._id || index}>
                      <ListItem alignItems="flex-start" sx={{ alignItems: 'center', px: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <BuildIcon />
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography fontWeight={600} variant="body1">
                              {req.description}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" color="text.secondary">
                                🏠 {req.hostel?.hostelName || 'Không rõ'} | 🛏 {req.room?.roomName || 'Không rõ'}
                              </Typography>
                              <Typography variant="caption" color="text.disabled">
                                📅 {new Date(req.createdAt).toLocaleString()}
                              </Typography>
                            </>
                          }
                        />
                        {req.image && (
                          <Box
                            component="img"
                            src={req.image}
                            alt="repair"
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 2,
                              ml: 2,
                              boxShadow: 2
                            }}
                          />
                        )}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
                          {req.status === REQUETS_STATUS.ACCEPTED &&
                            <Chip
                              label={req.status || 'Đã gửi'}
                              color='success'
                              size="small"
                              sx={{
                                fontSize: '0.9rem',
                                height: 30,
                                px: 2,
                                width:120,
                                borderRadius: '8px',
                                mb: 1
                              }}
                            />
                          }
                          {req.status === REQUETS_STATUS.REJECTED &&
                            <Chip
                              label={req.status || 'Đã gửi'}
                              color='warning'
                              size="small"
                              sx={{
                                fontSize: '0.9rem',
                                height: 30,
                                px: 2,
                                width:120,
                                borderRadius: '10px',
                                mb: 1
                              }}
                            />
                          }
                          {req.status === REQUETS_STATUS.PENDING &&
                            < Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                className="interceptor-loading"
                                variant="outlined"
                                color="success"
                                size="small"
                                sx={{

                                }}
                                onClick={() => updateRequest(REQUETS_STATUS.ACCEPTED, req._id)}
                              >
                                Chấp nhận
                              </Button>
                              <Button
                                className="interceptor-loading"
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => updateRequest(REQUETS_STATUS.REJECTED, req._id)}
                              >
                                Từ chối
                              </Button>

                            </Box>
                          }
                        </Box>
                      </ListItem>
                      {index < filteredRequests.length - 1 && <Divider component="li" sx={{ my: 1 }} />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box >
    </>
  )
}

export default Requests
