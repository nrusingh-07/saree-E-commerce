import { Order } from '@/types/product'
import { Modal } from '@mui/material'
import { useRouter } from 'next/navigation'
import React from 'react'
import OrderCardModal from './OrderCardModal'

interface OrderCardProps {
  order: Order
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const { _id, product, orderDate, paymentStatus, deliveryStatus, payment } =
    order

  const router = useRouter()

  const openModal = () => {
    setIsOpen(true)
  }

  return (
    <li className="w-full transform rounded-lg bg-white p-6 shadow-md transition-transform max1000:w-[96vw]">
      <div className="flex items-center gap-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-20 w-20 rounded-lg object-cover"
          onClick={() => {
            router.push(`/product/${product._id}`)
          }}
        />
        <div onClick={openModal}>
          <h5 className="line-clamp-1 max-h-16 max-w-xs overflow-hidden whitespace-normal text-xl">
            {product.name}
          </h5>
          <p>₹{product.boughtPrice * product.quantity}</p>
          <p>Qty: {product.quantity}</p>
        </div>
      </div>
      <div
        className="mt-4 flex items-center justify-between gap-4 text-sm"
        onClick={openModal}
      >
        <div>
          <p>Order Date: {new Date(orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p>Payment Status: {paymentStatus}</p>
          <p>Delivery Status: {deliveryStatus}</p>
        </div>
      </div>
      <div
        className="mt-4 flex items-center justify-between gap-4"
        onClick={openModal}
      >
        <p className="text-xs">Order ID: {_id}</p>
      </div>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        aria-labelledby="Order View"
        aria-describedby="Order View"
      >
        <div>
          <OrderCardModal order={order} setIsOpen={setIsOpen} />
        </div>
      </Modal>
    </li>
  )
}

export default OrderCard
