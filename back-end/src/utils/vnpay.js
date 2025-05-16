import crypto from 'crypto'
import qs from 'qs'
import { env } from '~/config/environment'
import moment from 'moment'
import { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } from 'vnpay'

export const createVNPayUrl = async (billId, amount, clientIp) => {
  const expireDate = moment().add(1, 'days').format('YYYYMMDDHHmmss')
  let createDate = moment().format('YYYYMMDDHHmmss')
  const vnpay = new VNPay({
    tmnCode: env.VNP_TMNCODE,
    secureSecret: env.VNP_HASHSECRET,
    vnpayHost: env.VNP_URL,
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger
  })

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Locale: VnpLocale.VN,
    // vnp_CurrCode: currCode,
    vnp_TxnRef: billId,
    vnp_OrderInfo: `Thanh toan ${billId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount,
    vnp_ReturnUrl: env.VNP_RETURN_URL,
    vnp_IpAddr: clientIp,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate
  })
  return vnpayResponse
  
}