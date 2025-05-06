import { StatusCodes } from 'http-status-codes'
import { contractService } from '~/services/contractService'

const createNew = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const createcontract = await contractService.createNew(userId, req.body)
    res.status(StatusCodes.CREATED).json(createcontract)

  } catch (error) {
    next(error)

  }
}
const getContracts = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const createcontract = await contractService.getContracts(userId)
    res.status(StatusCodes.CREATED).json(createcontract)
  } catch (error) {
    next(error)
  }
}

export const contractController = {
  createNew,
  getContracts
}