import { ColorOptionsEnum, FabricOptionsEnum } from '@/Static/Enums'
import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  discount: Number,
  discountedPrice: Number,
  quantity: Number,
  availability: Boolean,
  isCelebrity: {
    type: Boolean,
    default: false,
  },
  images: [String],
  color: {
    type: String,
    required: true,
    enum: Object.values(ColorOptionsEnum),
  },
  colors: [String],
  similarity: {
    type: String,
    required: true,
  },
  fabric: {
    type: String,
    required: true,
    enum: Object.values(FabricOptionsEnum),
  },
  occasion: String,
  size: String,
  weight: Number,
  brand: String,
  collections: [String],
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      rating: Number,
      review: String,
      date: Date,
      images: [String],
    },
  ],
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema)

export default Product
