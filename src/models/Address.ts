import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
})

const Address =
  mongoose.models.Address || mongoose.model('Address', addressSchema)

export default Address
