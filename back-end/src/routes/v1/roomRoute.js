import express from 'express'
import { roomValidation } from '~/validations/roomValidation'
import { roomController } from '~/controllers/roomController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, roomValidation.createNew, roomController.createNew )
  .delete(authMiddleware.isAuthorized, roomController.deleteRooms )

Router.route('/:id')
  .get(authMiddleware.isAuthorized, roomController.getDetails)
  .put(authMiddleware.isAuthorized, roomValidation.update, roomController.update)
  // .put(roomValidation.update, )
export const roomRoute = Router