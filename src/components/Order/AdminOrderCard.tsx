import { AdminOrder } from '@/types/product'
import React from 'react'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'
import { useUserAuth } from '@/context/AuthContext'
import axios from 'axios'
import { useUtilContext } from '@/context/UtilContext'
import { Modal } from '@mui/material'
import AdminOrderCardModal from './AdminOrderCardModal'

interface OrderCardProps {
  order: AdminOrder
  updateOrder: (order: AdminOrder) => void
}

const AdminOrderCard: React.FC<OrderCardProps> = ({ order, updateOrder }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { setLoader } = useUtilContext()
  const { user } = useUserAuth()

  const shipRequestFn = async () => {
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.post(
        `/api/admin/orders/${order._id}/ship`,
        { orderId: order._id },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      updateOrder(res.data.order)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const labelFn = async () => {
    if (order.shiprocket?.label) {
      window.open(order.shiprocket.label, '_blank')
      return
    }
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.post(
        `/api/admin/orders/${order._id}/label`,
        { orderId: order._id },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      updateOrder(res.data.order)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const invoiceFn = async () => {
    if (order.shiprocket?.invoice) {
      window.open(order.shiprocket.invoice, '_blank')
      return
    }
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.post(
        `/api/admin/orders/${order._id}/invoice`,
        { orderId: order._id },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      updateOrder(res.data.order)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const manifestFn = async () => {
    if (order.shiprocket?.manifested && order.shiprocket?.manifestLink) {
      window.open(order.shiprocket.manifestLink, '_blank')
      return
    }
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.post(
        `/api/admin/orders/${order._id}/manifest`,
        { orderId: order._id },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      updateOrder(res.data.order)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const cancelOrderFn = async () => {
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.post(
        `/api/admin/orders/${order._id}/cancel`,
        { orderId: order._id },
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )

      updateOrder(res.data.order)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  return (
    <li className="flex w-[94vw] max-w-[98rem] transform justify-between gap-2 rounded-lg bg-white p-4 shadow-md max500:flex-col">
      <div
        className="flex w-full cursor-pointer items-center justify-between gap-[0.1rem] max500:w-full max500:flex-col max500:items-start"
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <div>
          <p className="text-lg font-semibold">
            Name: {order.userId.firstName + ' ' + order.userId.lastName}
          </p>
          <p className="text-sm">Amount: ₹{order.paymentId.amount}</p>
          <p className="text-sm">Order ID: {order._id}</p>
          <p className="text-sm">
            Order Date: {new Date(order.orderDate).toLocaleString()}
          </p>
          <p className="text-sm">Payment ID: {order.paymentId._id}</p>
        </div>
        <div>
          <p className="text-sm">Payment: {order.paymentStatus}</p>
          <p className="text-sm">Delivery: {order.deliveryStatus}</p>
        </div>
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
          <AdminOrderCardModal
            invoiceFn={invoiceFn}
            labelFn={labelFn}
            manifestFn={manifestFn}
            order={order}
            setIsOpen={setIsOpen}
            shipRequestFn={shipRequestFn}
            cancelOrderFn={cancelOrderFn}
          />
        </div>
      </Modal>
    </li>
  )
}

export default AdminOrderCard
