import { StatusCodes } from 'http-status-codes'
import { paymentService } from '~/services/paymentService'

const createPayment = async (req, res, next) => {
  try {
    const { amount, billId } = req.body
    let ipAddr = req.headers['x-forwarded-for'] || '127.0.0.1'
    const result = await paymentService.createPayment(billId, amount, ipAddr)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const checkPayment = async (req, res, next) => {
  try {
    const result = paymentService.checkPayment(req.query)
    res.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    next(error)
  }
}
const getListPayment = async (req, res, next) => {
  try {
    const { hostelIds } = req.query
    console.log('hostelId', hostelIds)
    const result = await paymentService.getListPayment(hostelIds)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const paymentController = {
  createPayment,
  checkPayment,
  getListPayment
}