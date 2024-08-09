import mongoose from 'mongoose'

const impressionSchema = new mongoose.Schema({
  date: Date,
  time: String,
  year: Number,
  month: Number,
  day: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
})

const Impression =
  mongoose.models.Impression || mongoose.model('Impression', impressionSchema)

export default Impression
