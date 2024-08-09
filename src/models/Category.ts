import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
  name: String,
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  description: String,
  imageUrl: String,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  createdDate: {
    type: Date,
    default: Date.now,
  },
})

const Category =
  mongoose.models.Category || mongoose.model('Category', categorySchema)

export default Category
