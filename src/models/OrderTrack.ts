import mongoose from 'mongoose'

const OrderTrackSchema = new mongoose.Schema({
  awb: { type: String, unique: true },
  courierName: { type: String },
  currentStatus: { type: String },
  currentStatusId: { type: Number },
  shipmentStatus: { type: String },
  shipmentStatusId: { type: Number },
  currentTimestamp: { type: Date },
  orderId: { type: String, unique: true },
  srOrderId: { type: Number },
  etd: { type: Date },
  isReturn: { type: Number },
  channelId: { type: Number },
  scans: [
    {
      location: { type: String },
      date: { type: Date },
      activity: { type: String },
      status: { type: String },
      srStatus: { type: String },
      srStatusLabel: { type: String },
    },
  ],
})

const OrderTrack =
  mongoose.models.OrderTrack || mongoose.model('OrderTrack', OrderTrackSchema)

export default OrderTrack
