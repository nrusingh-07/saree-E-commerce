import DbConnect from '@/config/DbConfig'
import Order from '@/models/Order'
import OrderTrack from '@/models/OrderTrack'
import { NextRequest, NextResponse } from 'next/server'

const POST = async (req: NextRequest, res: Response) => {
  if (req.headers.get('x-api-key') !== process.env.ORDER_TRACK_API_KEY) {
    return new NextResponse('Unauthorized', {
      status: 401,
    })
  }
  const data = await req.json()
  const newData = {
    awb: data.awb,
    courierName: data.courier_name,
    currentStatus: data.current_status,
    currentStatusId: data.current_status_id,
    shipmentStatus: data.shipment_status,
    shipmentStatusId: data.shipment_status_id,
    currentTimestamp: data.current_timestamp,
    orderId: data.order_id,
    srOrderId: data.sr_order_id,
    etd: data.etd,
    isReturn: data.is_return,
    channelId: data.channel_id,
    scans: data.scans.map(
      (scan: {
        [x: string]: any
        location: any
        date: any
        activity: any
        status: any
      }) => ({
        location: scan.location,
        date: scan.date,
        activity: scan.activity,
        status: scan.status,
        srStatus: scan['sr-status'],
        srStatusLabel: scan['sr-status-label'],
      }),
    ),
  }

  await DbConnect()
  const orderTrack = await OrderTrack.findOne({
    orderId: newData.orderId,
  })
  if (orderTrack) {
    await OrderTrack.findOneAndUpdate({ orderId: newData.orderId }, newData)
  } else {
    const oT = await OrderTrack.create(newData)
    await Order.findOneAndUpdate(
      {
        'shiprocket.orderId': oT.orderId,
      },
      {
        'shiprocket.orderTrack': oT._id,
      },
    ).exec()
  }
  return new NextResponse('Success', {
    status: 200,
  })
}

export { POST }
