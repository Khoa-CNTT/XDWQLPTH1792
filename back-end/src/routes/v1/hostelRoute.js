import express from 'express'
import { hostelValidation } from '~/validations/hostelValidation'
import { hostelController } from '~/controllers/hostelController'
const Router = express.Router()

Router.route('/')
  .post(hostelValidation.createNew, hostelController.createNew )

Router.route('/:id')
  .get(hostelController.getDetails)
export const hostelRoute = Router