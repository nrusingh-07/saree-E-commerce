import { getSortOrders } from '@/Server/dashboard/orders'
import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (req: NextRequest, res: Response) => {
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

    const search = req.nextUrl.searchParams
    const sort = search.has('sort') ? search.get('sort') : ''
    const page = search.has('page') ? parseInt(search.get('page')!) : 1

    const { orders, totalOrders } = await getSortOrders(sort!, page)

    return new NextResponse(
      JSON.stringify({
        orders,
        totalOrders,
      }),
      {
        status: 200,
      },
    )
  } catch (e: any) {
    console.log(e)
    return new NextResponse(
      JSON.stringify({
        cart: e.message,
      }),
      {
        status: 200,
      },
    )
  }
}

export { GET }
