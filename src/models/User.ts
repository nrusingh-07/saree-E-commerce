import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  firstName: String,
  lastName: String,
  phoneNumber: {
    type: String,
    unique: true,
    required: true,
  },
  uid: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
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
    default: {},
  },
  orderHistory: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
      date: Date,
      totalAmount: Number,
      default: [],
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: [],
    },
  ],
  cart: {
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CartItem',
        default: [],
      },
    ],
    totalItems: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.models.User || mongoose.model('User', userSchema)

export default User
