import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import User from '@/models/User'
import { v4 as uuidv4 } from 'uuid'
import { NextRequest, NextResponse } from 'next/server'
import Crypto from 'crypto'
import axios from 'axios'

const POST = async (req: NextRequest, res: Response) => {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: 'No token provided',
        }),
        {
          status: 401,
        },
      )
    }

    const authCheck = await initAdmin().auth().verifyIdToken(token!)

    await DbConnect()

    const user = await User.findOne({
      $or: [{ uid: authCheck.uid }],
    })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 403,
        },
      )
    }

    if (!user.isAdmin) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not admin',
        }),
        {
          status: 403,
        },
      )
    }

    const merchant_id = process.env.PHONEPE_MERCHANT_ID
    const salt_key = process.env.PHONEPE_SALT_KEY

    const orderId = req.nextUrl.pathname
      .split('/admin/orders/')[1]
      .split('/cancel')[0]

    const order = await Order.findById(orderId).populate('paymentId').exec()

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          error: 'Order not found',
        }),
        {
          status: 404,
        },
      )
    }

    const data = {
      merchantId: merchant_id,
      merchantUserId: 'MUID9EFW8E9F89EWF8C',
      originalTransactionId: order.paymentId.transactionId,
      merchantTransactionId: order.paymentId._id.toString(),
      amount: order.paymentId.amount * 100,
      callbackUrl: 'https://webhook-test.com/ba708d8cdbb6952b9c432cb46a722f4a',
    }

    const payload = JSON.stringify(data)
    const payloadMain = Buffer.from(payload).toString('base64')
    const keyIndex = 1
    const string = payloadMain + '/pg/v1/refund' + salt_key
    const sha256 = Crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const options = {
      method: 'post',
      url: ' https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/refund',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain,
      },
    }

    const response = await axios(options)
    console.log(response.data)
    return new NextResponse(
      JSON.stringify({
        message: 'Order cancelled',
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({
        error: e.message,
      }),
      { status: 500 },
    )
  }
}

export { POST }
