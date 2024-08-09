import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Product from '@/models/Product'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (req: NextRequest, res: Response) => {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('q') || ''
    const limit = searchParams.get('limit') || 100
    const page = searchParams.get('page') || 1

    await DbConnect()

    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    })
      .limit(Number(limit))
      .skip(Number(limit) * (Number(page) - 1))

    if (!products) {
      return new NextResponse(
        JSON.stringify({
          error: 'Products not found',
        }),
        {
          status: 404,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        products,
        message: 'Products Found',
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
