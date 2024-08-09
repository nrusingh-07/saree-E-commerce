import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import User from '@/models/User'
import { NextResponse } from 'next/server'

const GET = async (req: Request, res: Response) => {
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
      .populate('orderHistory.orderId wishlist cart.items')
      .populate({
        path: 'cart.items',
        populate: {
          path: 'productId',
        },
      })
      .exec()

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

    return new NextResponse(
      JSON.stringify({
        user,
        message: 'User found',
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.log(e)
    return new NextResponse(e.message, {
      status: 500,
    })
  }
}

export { GET }
