import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  rating: Number,
  reviewText: String,
  images: [String],
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema)

export default Review
