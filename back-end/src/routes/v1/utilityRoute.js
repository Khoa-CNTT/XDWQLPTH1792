import express from 'express'
import { utilityValidation } from '~/validations/utilityValidation'
import { utilityController } from '~/controllers/utilityController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, utilityValidation.createNew, utilityController.createNew)
  .get(authMiddleware.isAuthorized, utilityController.getUtilitiesByHostelId)
  .delete(authMiddleware.isAuthorized, utilityController.deleteUtilities)
Router.route('/room')
  .get(authMiddleware.isAuthorized, utilityController.getUtilitiesByHostelId)

Router.route('/:id')
//   .get(authMiddleware.isAuthorized, roomController.getDetails)
  .put(authMiddleware.isAuthorized, utilityValidation.update, utilityController.update)
export const utilityRoute = Router