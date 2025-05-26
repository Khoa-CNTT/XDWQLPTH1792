import express from 'express'
import { contractValidation } from '~/validations/contractValidation'
import { contractController } from '~/controllers/contractController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, contractController.getContracts)
  .post(authMiddleware.isAuthorized, contractValidation.createNew, contractController.createNew)
Router.route('/:id')
  .put(authMiddleware.isAuthorized, contractValidation.update, contractController.update)
export const contractRoute = Router