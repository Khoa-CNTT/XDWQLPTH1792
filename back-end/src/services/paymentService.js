import { createVNPayUrl } from '~/utils/vnpay'
import { billModel } from '~/models/billsModel'
import { BILL_STATUS, PAYMENT_STATUS } from '~/utils/constants'
import { paymentModel } from '~/models/paymentModel'
import { utilityModel } from '~/models/utilityModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
const createPayment = async (billId, amount, ipAddr) => {
  try {
    const result = await createVNPayUrl(billId, amount, ipAddr)
    return result
  } catch (error) {
    throw error
  }
}
const checkPayment = async (data) => {
  try {
    const { vnp_Amount, vnp_BankCode, vnp_PayDate, vnp_TxnRef, vnp_TransactionNo, vnp_TransactionStatus } = data
    const isHasPayment = await paymentModel.findOneByBillId(vnp_TxnRef)
    if (isHasPayment?.transactionNo === vnp_TransactionNo) return
    const billDetail = billModel.findOneById(vnp_TxnRef)
    if (vnp_TransactionStatus === '00' || billDetail.totalAmount <= vnp_Amount) {
      const updatedBill = {
        status: BILL_STATUS.SUCCESS
      }
      await billModel.update(vnp_TxnRef, updatedBill)
    }
    const createData = {
      billId: vnp_TxnRef,
      txnRef: vnp_TxnRef,
      amount: Number(vnp_Amount) / 100,
      transactionNo: vnp_TransactionNo,
      transactionStatus: vnp_TransactionStatus,
      payDate: vnp_PayDate,
      bankCode: vnp_BankCode
    }
    if (vnp_TransactionStatus === '00') {
      createData.status = PAYMENT_STATUS.SUCCESS
    }
    const createNewPayment = await paymentModel.createNew(createData)
    const result = await paymentModel.findOneById(createNewPayment.insertedId)
    return result
  } catch (error) {
    throw error
  }
}
const getListPayment = async (hostelIds) => {
  try {
    const result = await paymentModel.findPaymentsByHostelIds(hostelIds)
    return result
  } catch (error) {
    throw error
  }
}
export const paymentService = {
  createPayment,
  checkPayment,
  getListPayment
}