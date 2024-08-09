import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Review from '@/models/Review'
import User from '@/models/User'
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

    const { productId, rating, reviewText, images } = await req.json()

    const reviewData = await Review.findOne({
      productId,
      userId: user._id,
    })

    if (reviewData) {
      return new NextResponse(
        JSON.stringify({
          review: reviewData,
          message: 'Review already exists',
        }),
        {
          status: 200,
        },
      )
    }

    const newReview = await Review.create({
      productId,
      userId: user._id,
      rating,
      reviewText,
      images,
    })

    if (!newReview) {
      return new NextResponse(
        JSON.stringify({
          error: 'Review not created',
        }),
        {
          status: 500,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        review: reviewData,
        message: 'Review Created',
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
