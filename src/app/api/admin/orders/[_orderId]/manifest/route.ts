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

    const orderId = req.nextUrl.pathname
      .split('/orders/')[1]
      .split('/manifest')[0]

    const order = await Order.findOne({
      _id: orderId,
    }).populate('products.productId paymentId userId')

    if (order.shiprocket.manifested && order.shiprocket.manifestLink) {
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
      url: 'https://apiv2.shiprocket.in/v1/external/manifests/generate',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      data: JSON.stringify({
        shipment_id: [parseInt(order.shiprocket.shipmentId)],
      }),
    })

    console.log(shiprocketResponse.data)

    if (!shiprocketResponse.data.manifest_url) {
      return new NextResponse(
        JSON.stringify({
          message: 'Not Manifested',
        }),
        {
          status: 500,
        },
      )
    }
    order.shiprocket.manifestId = true
    order.shiprocket.manifestLink = shiprocketResponse.data.manifest_url
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
    return new NextResponse(
      JSON.stringify({
        error: e.message,
      }),
      {
        status: 200,
      },
    )
  }
}

export { POST }
