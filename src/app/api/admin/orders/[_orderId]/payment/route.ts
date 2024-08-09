import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import Crypto from 'crypto'
import axios from 'axios'

const GET = async (req: NextRequest, res: Response) => {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]

    if (!token) {
      return new NextResponse(
        JSON.stringify({
          error: 'No token provided',
        }),
        {
          status: 500,
        },
      )
    }

    const authCheck = await initAdmin().auth().verifyIdToken(token!)

    await DbConnect()

    const user = await User.findOne({ uid: authCheck.uid })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 500,
        },
      )
    }

    const orderId = req.nextUrl.pathname
      .split('/admin/orders/')[1]
      .split('/payment')[0]

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

    const merchant_id = process.env.PHONEPE_MERCHANT_ID
    const salt_key = process.env.PHONEPE_SALT_KEY

    const keyIndex = 1
    const string =
      `/pg/v1/status/${merchant_id}/${order.paymentId._id.toString()}` +
      salt_key
    const sha256 = Crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const prod_URL = process.env.NEXT_PUBLIC_PHONEPE_API_ENDPOINT
    const response = await axios({
      method: 'get',
      url: `${prod_URL}/pg/v1/status/${merchant_id}/${order.paymentId._id.toString()}`,
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchant_id}`,
      },
    })

    console.log(response.data)

    return new NextResponse(
      JSON.stringify({
        success: 'Payment created',
      }),
      {
        status: 200,
      },
    )
  } catch (error: any) {
    console.log(error.response.data)
    return new NextResponse(
      JSON.stringify({
        error: 'Internal server error',
      }),
      {
        status: 500,
      },
    )
  }
}

export { GET }
