import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { hostelRoute } from './hostelRoute'
import { userRoute } from './userRoute'
import { roomRoute } from './roomRoute'
import { invitationRoute } from './invitationRoute'
import { conversationRoute } from './conversationRoute'
import { messageRoute } from './messageRoute'
import { contractRoute } from './contractRoute'
import { utilityRoute } from './utilityRoute'
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

// Conversation APIs
Router.use('/conversations', conversationRoute )

// Messages APIs
Router.use('/messages', messageRoute )

// Messages APIs
Router.use('/contracts', contractRoute )

// Utility APIs
Router.use('/utilities', utilityRoute )
export const APIs_V1 = Router


