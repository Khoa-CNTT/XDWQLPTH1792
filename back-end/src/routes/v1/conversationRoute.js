import express from 'express'
import { conversationValidation } from '~/validations/conversationValidation'
import { conversationController } from '~/controllers/conversationController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'
const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, conversationValidation.createNew, conversationController.createNew)
  .get(authMiddleware.isAuthorized, conversationController.getConversations)
Router.route('/:id')
  .get(authMiddleware.isAuthorized, conversationController.getDetails)
  .delete(authMiddleware.isAuthorized, conversationController.deleteConversation)
export const conversationRoute = Router