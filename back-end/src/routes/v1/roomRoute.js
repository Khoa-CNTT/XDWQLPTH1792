import express from 'express'
import { roomValidation } from '~/validations/roomValidation'
import { roomController } from '~/controllers/roomController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .post(roomValidation.createNew, roomController.createNew )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, roomController.getDetails)
  // .put(roomValidation.update, )
export const roomRoute = Router