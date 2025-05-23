import express from 'express'
import { facilityValidation } from '~/validations/facilityValidation'
import { facilityController } from '~/controllers/facilityController'
import { authMiddleware } from '~/middlewares/authMiddleware'
import { multerUploadMiddeware } from '~/middlewares/multerUploadMiddleware'
const Router = express.Router()


Router.route('/')
  .post(authMiddleware.isAuthorized, facilityValidation.createNew, facilityController.createNew)
  .get(authMiddleware.isAuthorized, facilityController.getAllFacilityByHostelId)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, facilityController.updateFacility)
  .delete(authMiddleware.isAuthorized, facilityController.deleteFacility)
export const facilityRoute = Router