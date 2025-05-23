import express from 'express'
import { paymentController } from '~/controllers/paymentController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()
Router.route('/create_payment')
  .post(paymentController.createPayment)
Router.route('/return_vnpay')
  .get(paymentController.checkPayment)
Router.route('/getListPayment')
  .get(paymentController.getListPayment)
export const paymentRoute = Router