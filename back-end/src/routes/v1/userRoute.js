import express from 'express'
import { userValidation } from '~/validations/userValidation'
import { userController } from '~/controllers/userController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'

const Router = express.Router()


Router.route('/register')
  .post(userValidation.createNew, userController.createNew)
Router.route('/generatePassword')
  .put(userValidation.generatePassword, userController.generatePassword)
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
Router.route('/')
  .get(authMiddleware.isAuthorized, userController.getAllAccounts)
Router.route('/deletAccount/:id')
  .put(authMiddleware.isAuthorized, userController.deleteAccount)
export const userRoute = Router