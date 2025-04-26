import express from 'express'
import { hostelValidation } from '~/validations/hostelValidation'
import { hostelController } from '~/controllers/hostelController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'
const Router = express.Router()

Router.route('/public')
  .get( hostelController.getHostelsPublic)
  .post(hostelValidation.findHostels, hostelController.findHostels)

Router.route('/')
  .post(authMiddleware.isAuthorized, hostelValidation.createNew, hostelController.createNew)
  .get(authMiddleware.isAuthorized, hostelController.getHostels)
  .delete(authMiddleware.isAuthorized, hostelController.deleteHostel)

Router.route('/uploadImages')
  .post(authMiddleware.isAuthorized, multerUploadMiddeware.upload.single('images'), hostelController.uploadImages)
Router.route('/:id')
  .get(authMiddleware.isAuthorized, hostelController.getDetails)
  .put(authMiddleware.isAuthorized, multerUploadMiddeware.upload.single('images'), hostelValidation.update, hostelController.update)
export const hostelRoute = Router