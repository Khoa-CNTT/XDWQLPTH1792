import { StatusCodes } from 'http-status-codes'
import { contractModel } from '~/models/contractModel'
import ApiError from '~/utils/ApiError'
import { CloudinaryProvider } from '~/providers/Cloudinary'
import { messageModel } from '~/models/messageModel'

const createNew = async (userId, data) => {
  try {
    const { tenantId } = data
    const findContractActive = await contractModel.findContract(userId, tenantId)
    if (findContractActive) {
      throw new ApiError(StatusCodes.CONFLICT, 'Hợp đồng của bạn và nhà trọ này đã được tạo và còn hiệu lực')
    }
    const dataCreate= {
      ...data,
      ownerId: userId
    }
    const createdContract = await contractModel.createNew(dataCreate)
    //lấy bản ghi contract sau khi gọi(Tùy vào dự án mà bước này có cần gọi  hay không)
    const getNewContract = await contractModel.findOneById(createdContract.insertedId)
    return getNewContract
  } catch (error) {
    throw error
  }
}

const getContracts = async (userId) => {
  try {
    const getAll = await contractModel.getContracts(userId)

    const result = getAll.map(c => ({
      ...c,
      ownerInfo: c.ownerInfo[0],
      tenantInfo: c.tenantInfo[0],
      roomInfo: c.roomInfo[0],
      hostelInfo: c.hostelInfo[0]
    })) 
    return result
  } catch (error) {
    throw error
  }
}

export const contractService = {
  createNew,
  getContracts
}