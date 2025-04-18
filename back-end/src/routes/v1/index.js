import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { hostelRoute } from './hostelRoute'
import { userRoute } from './userRoute'
import { roomRoute } from './roomRoute'
import { invitationRoute } from './invitationRoute'
const Router = express.Router()
//check APIs v1 stats
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    message: 'API is running'
  })
})
// Hostel APIs
Router.use('/hostel', hostelRoute)

// User APIs
Router.use('/users', userRoute)

// Room APIs
Router.use('/rooms', roomRoute)

// Invitation APIs
Router.use('/invitations', invitationRoute )
export const APIs_V1 = Router


