import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Payment from '@/models/Payment'
import Order from '@/models/Order'
import DbConnect from '@/config/DbConfig'
import Product from '@/models/Product'

const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const merchantTransactionId =
      req.nextUrl.pathname.split('/checkout/verify/')[1]
    const merchantId = process.env.PHONEPE_MERCHANT_ID
    const salt_key = process.env.PHONEPE_SALT_KEY

    const keyIndex = 1
    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` + salt_key
    const sha256 = crypto.createHash('sha256').update(string).digest('hex')
    const checksum = sha256 + '###' + keyIndex

    const prod_URL = process.env.NEXT_PUBLIC_PHONEPE_API_ENDPOINT
    const options = {
      method: 'GET',
      url: `${prod_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`,
      },
    }

    const response = await axios.request(options)

    const paymentAmount = response.data.data.amount
    const transactionId = response.data.data.transactionId
    const paymentInstrument = response.data.data.paymentInstrument

    await DbConnect()

    const payment = await Payment.findOne({
      _id: merchantTransactionId,
      verified: false,
    })

    if (!payment) {
      return new NextResponse(
        JSON.stringify({
          message: 'Payment not found',
        }),
        {
          status: 404,
        },
      )
    }

    if (paymentAmount !== payment.amount * 100) {
      return new NextResponse(
        JSON.stringify({
          message: 'Payment amount mismatch',
        }),
        {
          status: 500,
        },
      )
    }

    if (
      response.data.data.responseCode !== 'SUCCESS' ||
      response.data.data.state !== 'COMPLETED'
    ) {
      payment.status = 'Failed'
      await payment.save()

      return new NextResponse(
        JSON.stringify({
          message: 'Payment failed',
        }),
        {
          status: 500,
        },
      )
    }

    const order = await Order.findOne({
      _id: payment.orderId,
    }).populate('products.productId paymentId userId')

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          message: 'Order not found',
        }),
        {
          status: 404,
        },
      )
    }

    await Product.findByIdAndUpdate(order.products[0].productId._id, {
      $inc: { quantity: -order.products[0].quantity },
    })
    const product = await Product.findOne({
      _id: order.products[0].productId._id,
    })

    if (!product) {
      return new NextResponse(
        JSON.stringify({
          message: 'Product not found',
        }),
        {
          status: 404,
        },
      )
    }

    payment.transactionId = transactionId
    payment.status = 'Success'
    payment.paymentInstrument = paymentInstrument
    payment.paymentTime = new Date()
    payment.verified = true
    await payment.save()

    order.paymentStatus = 'Success'
    order.orderDate = payment.paymentTime
    await order.save()

    const currentDate = payment.paymentTime

    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`

    let data = JSON.stringify({
      order_id: order.uniqueOrderId,
      order_date: formattedDate,
      pickup_location: 'Primary',
      channel_id: '',
      comment: '',
      billing_customer_name: order.billing.name,
      billing_last_name: '',
      billing_address: order.billing.street,
      billing_address_2: '',
      billing_city: order.billing.city,
      billing_pincode: parseInt(order.billing.postalCode),
      billing_state: order.billing.state,
      billing_country: order.billing.country,
      billing_email: order.billing.email,
      billing_phone: order.billing.phoneNumber,
      shipping_is_billing: false,
      shipping_customer_name: order.billing.name,
      shipping_last_name: '',
      shipping_address: order.shipping.street,
      shipping_address_2: '',
      shipping_city: order.shipping.city,
      shipping_pincode: parseInt(order.shipping.postalCode),
      shipping_country: order.shipping.country,
      shipping_state: order.shipping.state,
      shipping_email: order.shipping.email,
      shipping_phone: order.shipping.phoneNumber,
      order_items: [
        {
          name: product.name,
          sku: product._id,
          units: parseInt(order.products[0].quantity),
          selling_price: parseInt(order.products[0].price),
        },
      ],
      payment_method: 'Prepaid',
      shipping_charges: 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total:
        parseInt(order.products[0].price) *
        parseInt(order.products[0].quantity),
      length: 40,
      breadth: 30,
      height: 3 * parseInt(order.products[0].quantity),
      weight: 1,
    })

    const shiprocketResponse = await axios({
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://apiv2.shiprocket.in/v1/external/orders/create/adhoc',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SHIPROCKET_API_KEY}`,
      },
      data: data,
    })

    await Order.findByIdAndUpdate(order._id, {
      $set: {
        'shiprocket.orderId': shiprocketResponse.data.order_id.toString(),
        'shiprocket.channelOrderId': shiprocketResponse.data.channel_order_id,
        'shiprocket.shipmentId': shiprocketResponse.data.shipment_id.toString(),
        'shiprocket.status': shiprocketResponse.data.status,
        'shiprocket.statusCode': shiprocketResponse.data.status_code.toString(),
        'shiprocket.onboardingCompletedNow':
          shiprocketResponse.data.onboarding_completed_now.toString(),
        'shiprocket.awbCode': shiprocketResponse.data.awb_code,
        'shiprocket.courierCompanyId':
          shiprocketResponse.data.courier_company_id,
        'shiprocket.courierName': shiprocketResponse.data.courier_name,
      },
    })
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/orders`)
  } catch (e: any) {
    console.log(e)
    return new NextResponse(e.message, {
      status: 500,
    })
  }
}

export { GET }
