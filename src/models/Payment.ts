import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  paymentMethod: {
    type: String,
    enum: ['PHONEPE', 'OTHER'], // Adjust as needed
    required: true,
  },
  transactionId: {
    type: String,
  },
  url: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Pending', 'Success', 'Failed', 'Refunded', 'Cancelled'], // Adjust as needed
    default: 'Pending',
  },
  paymentInstrument: {
    type: Object,
  },
  paymentTime: {
    type: Date,
  },
  amount: Number,
  verified: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', paymentSchema)

export default Payment
