import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
})

const CartItem =
  mongoose.models.CartItem || mongoose.model('CartItem', cartItemSchema)

export default CartItem
