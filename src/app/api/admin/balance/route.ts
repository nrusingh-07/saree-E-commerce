import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import User from '@/models/User'
import axios from 'axios'
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

    const response = await axios({
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://apiv2.shiprocket.in/v1/external/account/details/wallet-balance',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.SHIPROCKET_API_KEY,
      },
    })

    if (!response.data.data) {
      return new NextResponse(
        JSON.stringify({
          error: 'No data found',
        }),
        {
          status: 500,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Success',
        balance: response.data.data.balance_amount,
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
