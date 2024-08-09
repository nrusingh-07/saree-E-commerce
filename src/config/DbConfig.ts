import mongoose from 'mongoose'
import User from '@/models/User'
import Category from '@/models/Category'
import Order from '@/models/Order'
import Payment from '@/models/Payment'
import Product from '@/models/Product'
import Review from '@/models/Review'
import Address from '@/models/Address'
import CartItem from '@/models/CartItem'
import Impression from '@/models/Impression'
import OrderTrack from '@/models/OrderTrack'

let count = 0

const DB_URI = process.env.MONGO_URL as string

const DbConnect = async () => {
  try {
    const connect = await mongoose.connect(DB_URI)
    count++
    console.log('Db Connected')
    console.log(count)

    return {
      connect,
      User,
      Product,
      Category,
      Order,
      Payment,
      Review,
      Address,
      CartItem,
      Impression,
      OrderTrack,
    }
  } catch (e) {
    console.log(e)
  }
}

export default DbConnect
