import express from 'express'
import { requestValidation } from '~/validations/requestValidation'
import { requestController } from '~/controllers/requetsController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, requestController.getRequestsByTenantId)
  .post(authMiddleware.isAuthorized, requestValidation.createNew, requestController.createNewRequest)
Router.route('/hostelId')
  .get(authMiddleware.isAuthorized, requestController.getRequestsByHostelId)
Router.route('/:id')
  .put(authMiddleware.isAuthorized, requestValidation.update, requestController.updateRequest)
Router.route('/ownerId')
  .get(authMiddleware.isAuthorized, requestController.getRequestsByOwnerId)
export const requestRoute = Router