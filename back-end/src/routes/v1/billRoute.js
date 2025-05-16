import express from 'express'
import { billValidation } from '~/validations/billValidation'
import { billController } from '~/controllers/billController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, billController.getBillsByRoomId)
  .post(authMiddleware.isAuthorized, billValidation.createNew, billController.createNew)
  .delete(authMiddleware.isAuthorized, billController.deleteBill)
Router.route('/hostel')
  .get(authMiddleware.isAuthorized, billController.getBillsByRoomId)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, billValidation.update, billController.update)
export const billRoute = Router