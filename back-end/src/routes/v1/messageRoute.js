import express from 'express'
import { messageValidation } from '~/validations/messageValidation'
import { messageController } from '~/controllers/messageController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .get( messageController.getMessages)
  .post(authMiddleware.isAuthorized, messageValidation.createNew, messageController.createNew)
Router.route('/:id')
  .get(authMiddleware.isAuthorized, messageController.getDetails)

export const messageRoute = Router