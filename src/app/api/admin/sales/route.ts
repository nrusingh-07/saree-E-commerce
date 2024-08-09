import {
  impressionsPerMonthFn,
  salesAmountGraphFn,
  salesAmountPerMonthFn,
  salesQuantityGraphFn,
  salesQuantityPerMonthFn,
  usersPerMonthFn,
} from '@/Server/dashboard/sales'
import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
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

    const authCheck = await initAdmin().auth().verifyIdToken(token)

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

    const usersPerMonth = await usersPerMonthFn()
    const impressionPerMonth = await impressionsPerMonthFn()
    const salesAmountPerMonth = await salesAmountPerMonthFn()
    const salesQuantityPerMonth = await salesQuantityPerMonthFn()
    const salesAmountGraph = await salesAmountGraphFn()
    const salesQuantityGraph = await salesQuantityGraphFn()

    return new NextResponse(
      JSON.stringify({
        usersPerMonth,
        impressionPerMonth,
        salesAmountPerMonth,
        salesQuantityPerMonth,
        salesAmountGraph,
        salesQuantityGraph,
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
        status: 500,
      },
    )
  }
}

export { GET }
