import { addImpression } from '@/Server/product/impression'
import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Impression from '@/models/Impression'
import Product from '@/models/Product'
import Review from '@/models/Review'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'

const GET = async (req: NextRequest, res: Response) => {
  try {
    const productId = req.nextUrl.pathname.split('/user/product/')[1]

    // if (user) await addImpression(user._id, productId)

    await DbConnect()

    const product = await Product.findOne({ _id: productId })

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          error: 'Product not found',
        }),
        {
          status: 404,
        },
      )
    }

    // const impressions = await Impression.find({
    //   userId: user._id,
    //   productId: { $ne: product._id },
    // })
    //   .sort({ createdAt: 'desc' })
    //   .limit(4)
    //   .populate('productId')
    //   .exec()

    const similarProducts = await Product.find({
      similarity: product.similarity,
    })
      .select('images _id color')
      .exec()

    const revs = await Review.find({ productId: product._id })
      .populate('userId')
      .exec()

    // const ids: string[] = []

    // let recentProducts = impressions
    //   .map((impression) => impression.productId)
    //   .filter((p) => {
    //     if (ids.includes(p._id)) return false
    //     else {
    //       ids.push(p._id)
    //       return true
    //     }
    //   })

    const reviews = revs.map((review) => {
      return {
        _id: review._id,
        rating: review.rating,
        reviewText: review.reviewText,
        reviewer: review.userId.firstName + ' ' + review.userId.lastName,
        createdDate: review.createdDate,
        images: review.images,
      }
    })

    return new NextResponse(
      JSON.stringify({
        product,
        recentProducts: [],
        reviews,
        similarProducts,
      }),
      {
        status: 200,
      },
    )
  } catch (e) {
    console.log(e)
  }
}

export { GET }
