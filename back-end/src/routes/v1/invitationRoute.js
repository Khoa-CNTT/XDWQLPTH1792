import express from 'express'
import { invitationValidation } from '~/validations/invitationValidation'
import { invitationController } from '~/controllers/invitationController'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()
// Get inviatations by User
Router.route('/')
  .get(authMiddleware.isAuthorized, invitationController.getInvitations)
Router.route('/hostel')
  .post(
    authMiddleware.isAuthorized,
    invitationValidation.createNewHostelInvitation,
    invitationController.createNewHostelInvitation
  )
Router.route('/hostel/:invitationId')
  .put(authMiddleware.isAuthorized, invitationController.updateHostelInvitation)
export const invitationRoute = Router