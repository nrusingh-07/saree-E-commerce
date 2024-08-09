import { initAdmin } from '@/config/AdminFirebase'
import DbConnect from '@/config/DbConfig'
import User from '@/models/User'
import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Payment from '@/models/Payment'
import Product from '@/models/Product'
import Order from '@/models/Order'
import Address from '@/models/Address'

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

    const { productId, quantity, billingAddress, shippingAddress } =
      await req.json()
    await DbConnect()

    const product = await Product.findById(productId).select(
      'discountedPrice name',
    )

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

    if (product.quantity < quantity) {
      return new NextResponse(
        JSON.stringify({
          error: 'Not enough stock',
        }),
        {
          status: 400,
        },
      )
    }

    const amount = product.discountedPrice * quantity

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
      products: [
        {
          productId: productId,
          quantity: quantity,
          price: product.discountedPrice,
        },
      ],
      totalPrice: amount,
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
      products: [
        {
          productId: productId,
          quantity: quantity,
          price: product.discountedPrice,
        },
      ],
    })

    order.paymentId = payment._id
    await order.save()

    const data = {
      merchantId: merchant_id,
      merchantTransactionId: payment._id,
      merchantUserId: 'MUID9EFW8E9F89EWF8C',
      name: user.firstName + ' ' + user.lastName,
      amount: order.totalPrice * 100,
      redirectUrl: `${process.env.NEXT_PUBLIC_URL}/api/user/checkout/verify/${payment._id}`,
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
