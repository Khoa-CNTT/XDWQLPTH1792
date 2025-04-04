import express from 'express'
import { hostelValidation } from '~/validations/hostelValidation'
import { hostelController } from '~/controllers/hostelController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, hostelValidation.createNew, hostelController.createNew )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, hostelController.getDetails)
export const hostelRoute = Router