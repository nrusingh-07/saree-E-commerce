import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import User from '@/models/User'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import Payment from '@/models/Payment'
import Product from '@/models/Product'
import Order from '@/models/Order'

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
      .populate('cart.items')
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

    let insufficientItems = false

    const products = user.cart.items.map((item: any) => {
      if (item.quantity > item.productId.quantity) {
        insufficientItems = true
      }
      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.discountedPrice,
      }
    })

    if (insufficientItems) {
      return new NextResponse(
        JSON.stringify({
          error: 'Insufficient items',
        }),
        {
          status: 400,
        },
      )
    }

    const { billingAddress, shippingAddress } = await req.json()

    const merchant_id = process.env.PHONEPE_MERCHANT_ID
    const salt_key = process.env.PHONEPE_SALT_KEY

    user.address.billing = {
      name: billingAddress.name,
      street: billingAddress.street,
      city: billingAddress.city,
      state: billingAddress.state,
      postalCode: billingAddress.postalCode,
      country: billingAddress.country,
      phoneNumber: billingAddress.phoneNumber,
      email: billingAddress.email,
    }
    user.address.shipping = {
      name: shippingAddress.name,
      street: shippingAddress.street,
      city: shippingAddress.city,
      state: shippingAddress.state,
      postalCode: shippingAddress.postalCode,
      country: shippingAddress.country,
      phoneNumber: billingAddress.phoneNumber,
      email: billingAddress.email,
    }
    await user.save()

    const tempOrder = await Order.findOne({})
      .sort({ uniqueOrderId: -1 })
      .limit(1)
      .populate('products.productId paymentId userId')
      .exec()

    const order = await Order.create({
      userId: user._id,
      uniqueOrderId: tempOrder
        ? tempOrder.uniqueOrderId + 1
        : process.env.INITIAL_SHIPROCKET_UNIQUE_ORDER_ID,
      products: [...products],
      totalPrice: user.cart.totalPrice,
      paymentStatus: 'Pending',
      deliveryStatus: 'Pending',
      billing: {
        name: billingAddress.name,
        street: billingAddress.street,
        city: billingAddress.city,
        state: billingAddress.state,
        postalCode: billingAddress.postalCode,
        country: billingAddress.country,
        phoneNumber: billingAddress.phoneNumber,
        email: billingAddress.email,
      },
      shipping: {
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        phoneNumber: shippingAddress.phoneNumber,
        email: shippingAddress.email,
      },
    })

    const payment = await Payment.create({
      userId: user._id,
      orderId: order._id,
      paymentMethod: 'PHONEPE',
      status: 'Pending',
      amount: order.totalPrice,
      products: [...products],
    })

    order.paymentId = payment._id
    await order.save()

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: payment._id,
      merchantUserId: 'MUID9EFW8E9F89EWF8C',
      name: user.firstName + ' ' + user.lastName,
      amount: order.totalPrice * 100,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/api/user/checkout/cart/verify/${payment._id}`,
      redirectMode: 'REDIRECT',
      mobileNumber: user.phoneNumber,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }

    const payload = JSON.stringify(data)
    const payloadMain = Buffer.from(payload).toString('base64')
    const keyIndex = 1
    const string = payloadMain + '/pg/v1/pay' + salt_key
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const prod_URL = process.env.NEXT_PUBLIC_PHONEPE_API_ENDPOINT + '/pg/v1/pay'
    const options = {
      method: 'POST',
      url: prod_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain,
      },
    }
    const res = await axios.request(options)

    console.log(res.data.data.instrumentResponse)

    payment.url = res.data.data.instrumentResponse.redirectInfo.url
    await payment.save()

    return new NextResponse(
      JSON.stringify({
        payment,
        message: 'Payment initiated',
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
