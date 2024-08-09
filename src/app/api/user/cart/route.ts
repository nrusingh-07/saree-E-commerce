import { initAdmin } from '@/config/AdminFirebase'
import CartItem from '@/models/CartItem'
import Product from '@/models/Product'
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

    const user = await User.findOne({ uid: authCheck.uid })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
        },
      )
    }

    const { productId, quantity } = await req.json()

    const cartItem = await CartItem.findOne({
      productId,
      userId: user._id,
    })

    if (cartItem && user.cart.items.includes(cartItem._id)) {
      return new NextResponse(
        JSON.stringify({
          message: 'Product already in cart',
        }),
        {
          status: 200,
        },
      )
    }

    const product = await Product.findOne({ _id: productId })

    const newCartItem = await CartItem.create({
      productId,
      quantity: quantity ? (quantity > 1 ? quantity : 1) : 1,
      userId: user._id,
    })

    user.cart.items.push(newCartItem._id)
    user.cart.totalItems += newCartItem.quantity
    user.cart.totalPrice += newCartItem.quantity * product.discountedPrice

    await user.save()

    return new NextResponse(
      JSON.stringify({
        message: 'Product added to cart',
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

const PUT = async (req: NextRequest, res: Response) => {
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

    const user = await User.findOne({ uid: authCheck.uid })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
        },
      )
    }

    const { productId, quantity } = await req.json()

    const cartItem = await CartItem.findOne({
      productId,
      userId: user._id,
    })

    if (cartItem && !user.cart.items.includes(cartItem._id)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Product not found in cart',
        }),
        {
          status: 404,
        },
      )
    }

    const productItems = await CartItem.find({
      userId: user._id,
    }).populate('productId')

    let totalItems = 0
    let totalPrice = 0

    if (productItems) {
      productItems.forEach((item) => {
        if (item.productId._id.toString() === productId.toString()) {
          totalItems += quantity
          totalPrice += quantity * item.productId.discountedPrice
          return
        }
        totalItems += item.quantity
        totalPrice += item.quantity * item.productId.discountedPrice
      })
    }

    cartItem.quantity = quantity

    await cartItem.save()

    user.cart.totalItems = totalItems
    user.cart.totalPrice = totalPrice

    await user.save()

    return new NextResponse(
      JSON.stringify({
        message: 'Cart updated',
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

const DELETE = async (req: NextRequest, res: Response) => {
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

    const user = await User.findOne({ uid: authCheck.uid })

    if (!user) {
      return new NextResponse(
        JSON.stringify({
          error: 'User not found',
        }),
        {
          status: 404,
        },
      )
    }
    const productId = req.nextUrl.searchParams.get('productId')

    const cartItem = await CartItem.findOne({
      productId,
      userId: user._id,
    })

    if (cartItem && !user.cart.items.includes(cartItem._id)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Product not found in cart',
        }),
        {
          status: 404,
        },
      )
    }

    await CartItem.deleteOne({ _id: cartItem._id })

    user.cart.items = user.cart.items.filter(
      (item: any) => item.toString() !== cartItem._id.toString(),
    )
    user.cart.totalItems -= cartItem.quantity

    await user.save()

    return new NextResponse(
      JSON.stringify({
        message: 'Product removed from cart',
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

const GET = async (req: NextRequest, res: Response) => {
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

    const user = await User.findOne({ uid: authCheck.uid })
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
          status: 404,
        },
      )
    }

    return new NextResponse(
      JSON.stringify({
        cart: user.cart,
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

export { POST, PUT, DELETE, GET }
