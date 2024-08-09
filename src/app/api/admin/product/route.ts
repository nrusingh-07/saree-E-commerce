import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import Product from '@/models/Product'
import User from '@/models/User'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

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

    let {
      name,
      description,
      price,
      discount,
      quantity,
      availability,
      isCelebrity,
      collections,
      color,
      colors,
      similarity,
      fabric,
      occasion,
      size,
      weight,
      brand,
    } = await req.json()

    if (!similarity) {
      similarity = uuidv4()
    }

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      discountedPrice: Math.round(price - (price * discount) / 100),
      quantity,
      availability,
      isCelebrity,
      collections,
      color,
      colors,
      similarity,
      fabric,
      occasion,
      size,
      weight,
      brand,
    })

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          error: 'Product not created',
        }),
        {
          status: 500,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        product,
        message: 'Product Added',
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

const PUT = async (req: Request, res: Response) => {
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

    const {
      _id,
      name,
      description,
      price,
      discount,
      quantity,
      collections,
      availability,
      isCelebrity,
      images,
      color,
      colors,
      similarity,
      fabric,
      occasion,
      size,
      weight,
      brand,
    } = await req.json()

    const toUpdate: {
      [key: string]: string | number | boolean | string[]
    } = {}
    if (name) toUpdate['name'] = name
    if (description) toUpdate['description'] = description
    if (price) toUpdate['price'] = price
    if (discount) toUpdate['discount'] = discount
    if (quantity) toUpdate['quantity'] = quantity
    if (collections) toUpdate['collections'] = collections
    if (typeof availability !== 'undefined')
      toUpdate['availability'] = availability
    if (typeof isCelebrity !== 'undefined')
      toUpdate['isCelebrity'] = isCelebrity
    if (images) toUpdate['images'] = images
    if (color) toUpdate['color'] = color.trim()
    if (colors) toUpdate['colors'] = colors
    if (similarity) toUpdate['similarity'] = similarity
    if (fabric) toUpdate['fabric'] = fabric.trim()
    if (occasion) toUpdate['occasion'] = occasion
    if (size) toUpdate['size'] = size
    if (weight) toUpdate['weight'] = weight
    if (brand) toUpdate['brand'] = brand
    toUpdate['discountedPrice'] = Math.round(price - (price * discount) / 100)

    let product = await Product.findById(_id)

    const removedUrls: string[] = []

    if (images) {
      product.images.forEach((image: string) => {
        if (!images.includes(image)) {
          removedUrls.push(image)
        }
      })
    }

    // if (removedUrls.length > 0) {
    //   removedUrls.forEach(async (url) => {
    //     const res = await initAdmin().storage().bucket().file(url).delete()
    //     console.log(res)
    //   })
    // }

    product = await Product.findByIdAndUpdate(_id, toUpdate, {
      new: true,
    })

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          error: 'Product not updated',
        }),
        {
          status: 500,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        product,
        message: 'Product Updated',
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

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const limit = searchParams.get('limit') || 50
    const page = searchParams.get('page') || 1

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

    const products = await Product.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    })
      .skip(Number(limit) * (Number(page) - 1))
      .limit(Number(limit))

    const totalProducts = await Product.countDocuments({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    })

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
        totalProducts,
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

export { POST, PUT, GET }
