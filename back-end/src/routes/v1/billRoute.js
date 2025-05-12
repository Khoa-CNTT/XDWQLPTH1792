import express from 'express'
import { billValidation } from '~/validations/billValidation'
import { billController } from '~/controllers/billController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, billValidation.createNew, billController.createNew)
// Router.route('/pullTenant')
//   .put(authMiddleware.isAuthorized, roomValidation.pullTenant, roomController.pullTenant)

Router.route('/:id')
//   .get(authMiddleware.isAuthorized, roomController.getDetails)
  .put(authMiddleware.isAuthorized, billValidation.update, billController.update)
export const billRoute = Router