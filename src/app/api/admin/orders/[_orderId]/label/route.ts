import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import User from '@/models/User'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

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

    const orderId = req.nextUrl.pathname.split('/orders/')[1].split('/label')[0]

    const order = await Order.findOne({
      _id: orderId,
    }).populate('products.productId paymentId userId shiprocket.orderTrack')

    if (order.shiprocket.label) {
      return new NextResponse(
        JSON.stringify({
          order,
          message: 'Manifested',
        }),
        {
          status: 200,
        },
      )
    }

    const shiprocketResponse = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apiv2.shiprocket.in/v1/external/courier/generate/label',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      data: JSON.stringify({
        shipment_id: [parseInt(order.shiprocket.shipmentId)],
      }),
    })

    console.log(shiprocketResponse.data)

    if (!shiprocketResponse.data.label_url) {
      return new NextResponse(
        JSON.stringify({
          message: 'No Label',
        }),
        {
          status: 500,
        },
      )
    }
    order.shiprocket.label = shiprocketResponse.data.label_url
    await order.save()

    return new NextResponse(
      JSON.stringify({
        order,
        message: 'Manifested',
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.log(e)
    return new NextResponse(JSON.stringify({ error: e.message }), {
      status: 500,
    })
  }
}

export { POST }
