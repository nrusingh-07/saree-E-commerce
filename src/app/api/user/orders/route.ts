import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import User from '@/models/User'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

const limit = 10

const GET = async (req: NextRequest, res: NextResponse) => {
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

    const page: number =
      (req.nextUrl.searchParams.has('page') &&
        parseInt(req.nextUrl.searchParams.get('page') as string)) ||
      1

    const orders = await Order.aggregate([
      {
        $match: {
          userId: user._id,
        },
      },
      {
        $sort: {
          createdDate: -1,
        },
      },
      {
        $unwind: '$products',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'products.productInfo',
        },
      },
      {
        $unwind: '$products.productInfo',
      },
      {
        $lookup: {
          from: 'payments',
          localField: 'paymentId',
          foreignField: '_id',
          as: 'paymentInfo',
        },
      },
      {
        $lookup: {
          from: 'ordertracks', // Assuming 'ordertracks' is the collection name for orderTrack
          localField: 'shiprocket.orderTrack',
          foreignField: '_id',
          as: 'orderTrackInfo',
        },
      },
      {
        $project: {
          _id: 1,
          orderDate: 1,
          isFullFilled: 1,
          product: {
            _id: '$products.productId',
            quantity: '$products.quantity',
            boughtPrice: '$products.price',
            name: '$products.productInfo.name',
            images: '$products.productInfo.images',
            price: '$products.productInfo.price',
            discountedPrice: '$products.productInfo.discountedPrice',
            discount: '$products.productInfo.discount',
          },
          paymentStatus: 1,
          deliveryStatus: 1,
          payment: {
            $arrayElemAt: ['$paymentInfo', 0],
          },
          shiprocket: {
            orderTrack: {
              $arrayElemAt: ['$orderTrackInfo', 0],
            },
            orderId: '$shiprocket.orderId',
            channelOrderId: '$shiprocket.channelOrderId',
            shipmentId: '$shiprocket.shipmentId',
            status: '$shiprocket.status',
            statusCode: '$shiprocket.statusCode',
            onboardingCompletedNow: '$shiprocket.onboardingCompletedNow',
            awbCode: '$shiprocket.awbCode',
            courierCompanyId: '$shiprocket.courierCompanyId',
            courierName: '$shiprocket.courierName',
            invoice: '$shiprocket.invoice',
            label: '$shiprocket.label',
            manifested: '$shiprocket.manifested',
            manifestLink: '$shiprocket.manifestLink',
          },
        },
      },
    ])
      .skip((page - 1) * limit)
      .limit(limit)

    const totalOrders = await Order.countDocuments({ userId: user._id })

    return new NextResponse(JSON.stringify({ orders, totalOrders }), {
      status: 200,
    })
  } catch (e: any) {
    return new NextResponse(
      JSON.stringify({
        message: e.message,
      }),
      {
        status: 500,
      },
    )
  }
}

export { GET }
