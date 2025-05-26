/**
 * Updated by 0dev.com's author on August 17 2023
 * YouTube: https://youtube.com/@0dev
 * 'A bit of fragrance clings to the hand that gives flowers!'
 */
import Joi from 'joi'

import { ObjectId } from 'mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { GET_DB } from '~/config/mongodb'
import { PAYMENT_STATUS } from '~/utils/constants'
import { billModel } from './billsModel'
import { utilityModel } from './utilityModel'

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const PAYMENT_STATUS_COLLECTION_NAME = 'payments'
const PAYMENT_COLLECTION_SCHEMA = Joi.object({
  billId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  txnRef: Joi.string().required(),
  amount: Joi.number().required(),
  bankCode: Joi.string().required(),
  transactionNo: Joi.string().required(),
  transactionStatus: Joi.string().required(),
  payDate: Joi.date().required(),
  status: Joi.string().valid(...Object.values(PAYMENT_STATUS)).default(PAYMENT_STATUS.FAILED),
  createdAt: Joi.date().timestamp('javascript').default(Date.now())
})
const validateBeforeCreate = async (data) => {
  return await PAYMENT_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data)
    const newpaymentToAdd = {
      ...valiData,
      billId: new ObjectId(valiData.billId)
    }
    const createdPayment = await GET_DB().collection(PAYMENT_STATUS_COLLECTION_NAME).insertOne(newpaymentToAdd)
    return createdPayment
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(PAYMENT_STATUS_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findOneByBillId = async (billId) => {
  try {
    const result = await GET_DB().collection(PAYMENT_STATUS_COLLECTION_NAME).findOne({
      billId: new ObjectId(billId)
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}
const findPaymentsByHostelIds = async (billIds) => {
  try {
    const objectIds = billIds?.map(id => new ObjectId(id))
    const result = await GET_DB().collection(PAYMENT_STATUS_COLLECTION_NAME).aggregate([
      {
        $lookup: {
          from: billModel.BILL_STATUS_COLLECTION_NAME,
          localField: 'billId',
          foreignField: '_id',
          as: 'bill'
        }
      },
      { $unwind: '$bill' },

      // 2. Join utility
      {
        $lookup: {
          from: utilityModel.UTILITY_COLLECTION_NAME,
          localField: 'bill.utilityId',
          foreignField: '_id',
          as: 'utility'
        }
      },
      { $unwind: '$utility' },

      // 3. Filter by hostelIds
      {
        $match: {
          'utility.hostelId': { $in: objectIds } // objectIds = hostelIds dạng ObjectId
        }
      }
    ]).toArray()
    return result
  } catch (error) {
    throw new Error(error)
  }
}
export const paymentModel = {
  PAYMENT_COLLECTION_SCHEMA,
  PAYMENT_STATUS_COLLECTION_NAME,
  createNew,
  findOneById,
  findOneByBillId,
  findPaymentsByHostelIds
}