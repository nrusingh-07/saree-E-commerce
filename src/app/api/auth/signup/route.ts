import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import User from '@/models/User'
import { NextResponse } from 'next/server'

const POST = async (req: Request, res: Response) => {
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

    const { firstName, lastName } = await req.json()

    if (!firstName || !lastName) {
      return new NextResponse(
        JSON.stringify({
          error: 'First name and last name are required',
        }),
        {
          status: 500,
        },
      )
    }

    const userExists = await User.findOne({
      $or: [
        { uid: authCheck.uid },
        { email: authCheck.email },
        { phoneNumber: authCheck.phone_number },
      ],
    })

    if (userExists) {
      return new NextResponse(
        JSON.stringify({
          error: 'User Exists',
        }),
        {
          status: 403,
        },
      )
    }

    await User.create({
      uid: authCheck.uid,
      firstName,
      lastName,
      email: authCheck.email,
      phoneNumber: authCheck.phone_number,
    })

    const user = await User.findOne({
      $or: [{ uid: authCheck.uid }],
    }).populate(
      'address.billing address.shipping orderHistory.orderId wishlist cart.items',
    )

    return new NextResponse(
      JSON.stringify({
        user,
        message: 'Singed up successfully',
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

export { POST }
