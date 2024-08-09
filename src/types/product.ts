import { Userdata } from './user'

export interface Review {
  _id: string
  reviewer: string
  rating: number
  createdDate: string
  reviewText: string
  images: string[] // Change imageUrl to imageUrls and make it an array
}

export interface Order {
  _id: string
  uniqueOrderId: string
  product: {
    _id: string
    images: string[]
    name: string
    price: number
    discountedPrice: number
    discount: number
    boughtPrice: number
    quantity: number
  }
  shiprocket: {
    orderId: string
    orderTrack: null | OrderTrack
    ChannelOrderId: string
    shipmentId: string
    status: string
    statusCode: string
    onboardingCompletedNow: boolean
    awbCode: string
    courierCompanyId: string
    courierName: string
    invoice: string
    label: string
    manifested: boolean
    manifestLink: string
  }
  payment: {
    _id: string
    amount: number
    createDate: string
    orderId: string
    paymentInstrument: Object
    paymentMethod: string
    paymentTime: string
    status: string
    transactionId: string
    url: string
  }
  orderDate: string
  isFullFilled: boolean
  paymentStatus: string
  billing: {
    street: string
    city: string
    country: string
    name: string
    state: string
    postalCode: string
    phoneNumber: Number
    email: string
  }
  shipping: {
    street: string
    city: string
    country: string
    name: string
    state: string
    postalCode: string
    phoneNumber: Number
    email: string
  }
  deliveryStatus: string
  createdDate: string
}

export interface OrderTrack {
  awb: string
  courierName: string
  currentStatus: string
  currentStatusId: string
  shipmentStatus: string
  shipmentStatusId: string
  currentTimestamp: string
  orderId: string
  srOrderId: string
  etd: string
  isReturn: string
  channelId: string
  scans: [
    {
      _id: string
      location: string
      date: string
      activity: string
      status: string
      srStatus: string
      srStatusLabel: string
    },
  ]
}

export interface AdminOrder {
  _id: string
  userId: Userdata
  uniqueOrderId: string
  products: [
    {
      productId: {
        _id: string
        images: string[]
        name: string
        price: number
        discountedPrice: number
        discount: number
        boughtPrice: number
        quantity: number
      }
      quantity: number
      price: number
    },
  ]
  shiprocket: {
    orderId: string
    orderTrack: null | OrderTrack
    ChannelOrderId: string
    shipmentId: string
    status: string
    statusCode: string
    onboardingCompletedNow: boolean
    awbCode: string
    courierCompanyId: string
    courierName: string
    invoice: string
    label: string
    manifested: boolean
    manifestLink: string
  }
  paymentId: {
    _id: string
    amount: number
    createDate: string
    orderId: string
    paymentInstrument: Object
    paymentMethod: string
    paymentTime: string
    status: string
    transactionId: string
    url: string
  }
  orderDate: string
  isFullFilled: boolean
  paymentStatus: string
  billing: {
    street: string
    city: string
    country: string
    name: string
    state: string
    postalCode: string
    phoneNumber: Number
    email: string
  }
  shipping: {
    street: string
    city: string
    country: string
    name: string
    state: string
    postalCode: string
    phoneNumber: Number
    email: string
  }
  deliveryStatus: string
  createdDate: string
}
