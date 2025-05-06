import { useEffect, useState } from 'react'
import moment from 'moment'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import DoneIcon from '@mui/icons-material/Done'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInvitationsAPI, selectCurrentNotifications, updateHostelInvitationAPI, addNotification } from '~/redux/notifications/notificationsSlice'
import { useNavigate } from 'react-router-dom'

import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketClient'
const HOSTEL_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

function Notifications() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClickNotificationIcon = (event) => {
    setAnchorEl(event.currentTarget)
    // Khi click vào phần thông báo thì set lại trạng thaiscuar biến newnotification về fales
    setNewNotification(false)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // lấy dữ liệu notification từ trong redux
  const notifications = useSelector(selectCurrentNotifications)

  //fetch danh sách các lời mời invitation
  const dispatch = useDispatch()

  // Biến state đơn giản để kiểm tra nó co thông báo mới hay không
  const [newNotification, setNewNotification] = useState(false)
  // Lấy dữ liệu user từ trong redux
  const currentUser = useSelector(selectCurrentUser)
  useEffect(() => {
    dispatch(fetchInvitationsAPI())
    //Tạo 1 cái function sử lý khi nhận được xự kiện realtime, docs hướng dẫn
    //https://socket.io/how-to/use-with-react

    const onReceiveNewInvitation = (invitation) => {
      // Nếu thằng user đang đăng nhập hiện tại trong redux chính là thằng invitee trong bản ghi invitation
      if (invitation.inviteeId === currentUser._id) {
        //B1: Thêm bản ghi ivitation mới vào trong redux
        dispatch(addNotification(invitation))
        //B2: Cập nhật trang thái đang có thông  báo đến
        setNewNotification(true)
      }
    }
    //Lắng nghe 1 sự kiện real-time có tên là BE_USER_INVITED_TO_hostel từ phía server gởi về
    socketIoInstance.on('BE_USER_INVITED_TO_HOSTEL', onReceiveNewInvitation)
    //Clean Up sự kiên ngăn chn việc bị đăng ký lắp lại sự kiện (link docs ở trên)
    //https://socket.io/how-to/use-with-react#cleanup
    return () => {
      socketIoInstance.off('BE_USER_INVITED_TO_HOSTEL', onReceiveNewInvitation)
    }

  }, [dispatch, currentUser._id])
  const navigate = useNavigate()
  // Cập nhật trạng thái của lời mời join hostel
  const updateHostelInvitation = (status, invitationId) => {
    dispatch(updateHostelInvitationAPI({ status, invitationId })).them(res => {
      if (res.payload.hostelInvitation.status === HOSTEL_INVITATION_STATUS.ACCEPTED) {
        navigate(`/hostel/${res.payload.hostelInvitation.hostelId}`)
      }
    })
  }

  return (
    <Box>
      <Tooltip title="Notifications">
        <Badge
          color="warning"
          // variant="none"
          // variant="dot"
          variant={newNotification ? 'dot' : 'none'}
          sx={{ cursor: 'pointer' }}
          id="basic-button-open-notification"
          aria-controls={open ? 'basic-notification-drop-down' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClickNotificationIcon}
        >
          <NotificationsNoneIcon sx={{
            color: newNotification ? 'yellow' : 'white'
          }} />
        </Badge>
      </Tooltip>

      <Menu
        sx={{ mt: 2 }}
        id="basic-notification-drop-down"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
      >
        {(!notifications || notifications.length === 0) &&
          <MenuItem sx={{ minWidth: 200 }}>You do not have any new notifications.</MenuItem>}
        {notifications?.map((notification, index) =>
          <Box key={index}>
            <MenuItem sx={{
              minWidth: 200,
              maxWidth: 360,
              overflowY: 'auto'
            }}>
              {notification.type === 'HOSTEL_INVITATION' &&
              <Box sx={{ maxWidth: '100%', wordBreak: 'break-word', whiteSpace: 'pre-wrap', display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Nội dung của thông báo */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box><GroupAddIcon fontSize="small" /></Box>
                  <Box><strong>{notification?.inviter?.displayName}</strong> đã mời bạn vào <strong>{notification?.hostel?.hostelName}</strong></Box>
                </Box>

                {/* Khi Status của thông báo này là PENDING thì sẽ hiện 2 Button */}
                {notification?.hostelInvitation?.status === HOSTEL_INVITATION_STATUS.PENDING &&
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => updateHostelInvitation(HOSTEL_INVITATION_STATUS.ACCEPTED, notification._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      className="interceptor-loading"
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => updateHostelInvitation(HOSTEL_INVITATION_STATUS.REJECTED, notification._id)}
                    >
                      Reject
                    </Button>
                  </Box>
                }
                {/* Khi Status của thông báo này là ACCEPTED hoặc REJECTED thì sẽ hiện thông tin đó lên */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  {notification?.hostelInvitation?.status === HOSTEL_INVITATION_STATUS.ACCEPTED &&
                    <Chip icon={<DoneIcon />} label="Accepted" color="success" size="small" />
                  }
                  {notification?.hostelInvitation?.status === HOSTEL_INVITATION_STATUS.REJECTED &&
                    <Chip icon={<NotInterestedIcon />} label="Rejected" size="small" />
                  }
                </Box>
                {/* Thời gian của thông báo */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="span" sx={{ fontSize: '13px' }}>
                    {moment(notification?.createdAt).format('llll')}
                  </Typography>
                </Box>
              </Box>
              }
            </MenuItem>
            {/* Cái đường kẻ Divider sẽ không cho hiện nếu là phần tử cuối */}
            {index !== (notifications?.length - 1) && <Divider />}
          </Box>
        )}
      </Menu>
    </Box>
  )
}

export default Notifications
