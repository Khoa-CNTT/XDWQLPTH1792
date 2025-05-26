import { StatusCodes } from 'http-status-codes'

import { invitationService } from '~/services/invitationService'
import { requestService } from '~/services/requestService'

const createNewRequest = async (req, res, next) => {
  try {
    //User thực hiện request này chính là Inviter - người đi mời
    const tenantId = req.jwtDecoded._id
    const resRequest = await requestService.createNew(req.body, tenantId)
    res.status(StatusCodes.CREATED).json(resRequest)
  } catch (error) {
    next(error)
  }
}

const getRequestsByTenantId = async (req, res, next) => {
  try {
    const tenantId = req.jwtDecoded._id
    const resRequests = await requestService.getRequests({ tenantId })
    res.status(StatusCodes.OK).json(resRequests)
  }
  catch (error) {
    next(error)
  }
}
const getRequestsByHostelId = async (req, res, next) => {
  try {
    const { hostelId } = req.query
    const resRequests = await requestService.getRequests({ hostelId })
    res.status(StatusCodes.OK).json(resRequests)
  }
  catch (error) {
    next(error)
  }
}

const updateRequest = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const requestId = req.params.id
    const { status } = req.body
    const updatedRequest = await requestService.updateRequest(userId, requestId, status)
    res.status(StatusCodes.OK).json(updatedRequest)
  }
  catch (error) {
    next(error)
  }
}
const getRequestsByOwnerId = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const updatedRequest = await requestService.getRequestsByOwnerId(userId)
    res.status(StatusCodes.OK).json(updatedRequest)
  }
  catch (error) {
    next(error)
  }
}

export const requestController = {
  createNewRequest,
  getRequestsByTenantId,
  getRequestsByHostelId,
  updateRequest,
  getRequestsByOwnerId
}