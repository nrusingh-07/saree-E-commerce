import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  uniqueOrderId: {
    type: Number,
    unique: true,
    required: true,
  },
  shiprocket: {
    orderId: {
      type: String,
      default: '',
    },
    orderTrack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderTrack',
      default: null,
    },
    channelOrderId: {
      type: String,
      default: '',
    },
    shipmentId: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
    statusCode: {
      type: String,
      default: '',
    },
    onboardingCompletedNow: {
      type: Boolean,
      default: false,
    },
    awbCode: {
      type: String,
      default: '',
    },
    courierCompanyId: {
      type: String,
      default: '',
    },
    courierName: {
      type: String,
      default: '',
    },
    invoice: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    manifested: {
      type: Boolean,
      default: false,
    },
    manifestLink: {
      type: String,
      default: '',
    },
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: Number,
      price: Number,
    },
  ],
  isFullFilled: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  billing: {
    name: {
      type: String,
      default: '',
    },
    street: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: Number,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
  },
  shipping: {
    name: {
      type: String,
      default: '',
    },
    street: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    postalCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: Number,
      default: '',
    },
    email: {
      type: String,
      default: '',
    },
  },
  totalPrice: Number,
  orderDate: Date,
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Success', 'Failed'],
    default: 'Pending',
  },
  deliveryStatus: {
    type: String,
    enum: ['Pending', 'ShipRequested', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order
