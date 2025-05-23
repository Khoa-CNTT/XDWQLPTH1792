import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()


Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)
Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .delete(userController.logout)
Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddeware.upload.single('avatar'),
    userValidation.update,
    userController.update)
Router.route('/:id')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddeware.upload.single('avatar'),
    userValidation.update,
    userController.updateByAdmin)
  .delete(authMiddleware.isAuthorized, userController.deleteAccount)
Router.route('/')
  .get(authMiddleware.isAuthorized, userController.getAllAccounts)
export const userRoute = Router