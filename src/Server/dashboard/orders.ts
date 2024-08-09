import Order from '@/models/Order'

const limit = 20

export const getSortOrders = async (sort: string, page: number) => {
  let orders
  let totalOrders
  switch (sort) {
    case 'newest':
      orders = await Order.find({
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'oldest':
      orders = await Order.find({
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'price-low':
      orders = await Order.find({
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ totalPrice: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'price-high':
      orders = await Order.find({
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ totalPrice: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'no-invoice':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.invoice': '',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
        'shiprocket.invoice': '',
      })
      return { orders, totalOrders }

    case 'invoice':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.invoice': { $ne: '' },
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
        'shiprocket.invoice': { $ne: '' },
      })
      return { orders, totalOrders }

    case 'no-manifest':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.manifest': '',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
        'shiprocket.manifest': '',
      })
      return { orders, totalOrders }

    case 'manifest':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.manifest': { $ne: '' },
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
        'shiprocket.manifest': { $ne: '' },
      })
      return { orders, totalOrders }

    case 'no-label':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.label': '',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        deliveryStatus: 'Delivered',
        paymentStatus: 'Success',
        'shiprocket.label': '',
      })
      return { orders, totalOrders }

    case 'label':
      orders = await Order.find({
        paymentStatus: 'Success',
        'shiprocket.label': { $ne: '' },
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
        'shiprocket.label': { $ne: '' },
      })
      return { orders, totalOrders }

    case 'ship-pending':
      orders = await Order.find({
        deliveryStatus: 'Pending',
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        deliveryStatus: 'Pending',
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'ship-requested':
      orders = await Order.find({
        deliveryStatus: 'ShipRequested',
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        deliveryStatus: 'ShipRequested',
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'shipped':
      orders = await Order.find({
        deliveryStatus: 'Shipped',
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        deliveryStatus: 'Shipped',
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }

    case 'delivered':
      orders = await Order.find({
        deliveryStatus: 'Delivered',
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        deliveryStatus: 'Delivered',
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }
    default:
      orders = await Order.find({
        paymentStatus: 'Success',
      })
        .populate('products.productId paymentId userId shiprocket.orderTrack')
        .sort({ orderDate: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
      totalOrders = await Order.countDocuments({
        paymentStatus: 'Success',
      })
      return { orders, totalOrders }
  }
}
