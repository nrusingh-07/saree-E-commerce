export interface CartItem {
  productId: string | ProductType
  userId: string | Userdata
  quantity: number
}

export interface Address {
  name: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  phoneNumber: string
  email: string
}

export interface Userdata {
  _id: string
  isAdmin: boolean
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  uid: string
  address: {
    billing: Address
    shipping: Address
  }
  orderHistory: {
    orderId: string
    date: Date
    totalAmount: number
  }
  wishlist: {
    type: string
  }
  cart: {
    items: string[] | CartItem[]
    totalItems: number
    totalPrice: number
  }
  createdDate: Date
}

export interface ProductType {
  _id: string
  availability: boolean
  isCelebrity: boolean
  brand: string
  color: string
  colors: string[]
  createdDate: string
  description: string
  discount: number
  fabric: string
  collections: string[]
  images: string[]
  name: string
  occasion: string
  price: number
  discountedPrice: number
  quantity: number
  ratings: any[] // Assuming ratings can be of any type, adjust as needed
  similarity: string
  size: string
  weight: number
}
