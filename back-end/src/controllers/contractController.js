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
const update = async (req, res, next) => {
  try {
    const contractId = req.params.id
    // Chỉ lấy hostel thuộc về user nào đó thôi
    const updatedHostel = await contractService.update(contractId, req.body)
    //kết quả trả về phía CLient
    res.status(StatusCodes.OK).json(updatedHostel)
    // throw new ApiError(StatusCodes.BAD_GATEWAY,'0dev test error')
  } catch (error) {
    next(error)
  }
}
export const contractController = {
  createNew,
  getContracts,
  update
}