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
      .split('/admin/orders/')[1]
      .split('/ship')[0]

    const order = await Order.findOne({ _id: orderId }).populate(
      'products.productId paymentId userId shiprocket.orderTrack',
    )

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

    const data = JSON.stringify({
      shipment_id: parseInt(order.shiprocket.shipmentId),
    })

    const shipResponse = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apiv2.shiprocket.in/v1/external/courier/assign/awb',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      data: data,
    })

    console.log(shipResponse.data)

    order.deliveryStatus = 'ShipRequested'
    order.shiprocket.awbCode = shipResponse.data.response.data.awb_code
    order.shiprocket.courierCompanyId = parseInt(
      shipResponse.data.response.data.courier_company_id,
    )
    order.shiprocket.courierName = shipResponse.data.response.data.courier_name
    await order.save()

    await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apiv2.shiprocket.in/v1/external/courier/generate/pickup',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      data: JSON.stringify({
        shipment_id: [parseInt(order.shiprocket.shipmentId)],
      }),
    })

    return new NextResponse(
      JSON.stringify({
        message: 'Ship Request',
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.log(e.response.data)
    return new NextResponse(
      JSON.stringify({
        error: e.message,
      }),
      {
        status: 500,
      },
    )
  }
}

export { POST }
