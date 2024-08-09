import { AdminOrder, Order } from '@/types/product'
import { Box } from '@mui/material'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'
import { IoClose } from 'react-icons/io5'

interface AdminOrderCardModalProps {
  order: Order
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const OrderCardModal: React.FC<AdminOrderCardModalProps> = ({
  order,
  setIsOpen,
}) => {
  const openLink = (url: string) => {
    window.open(url, '_blank')
    return
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 8,
        width: '96vw',
        height: '96vh',
      }}
    >
      <div className="relative flex h-full w-full gap-10 overflow-auto rounded-lg bg-white p-16 max1250:gap-4 max1000:w-[96vw] max1000:flex-col max1000:p-10 max500:p-4 min1000:justify-between">
        <div className="flex flex-col gap-3">
          <ul className="flex flex-col gap-1">
            <li key={order.product._id}>
              <div className="flex items-center gap-4">
                <img
                  src={order.product.images[0]}
                  alt={order.product.name}
                  className="h-28 w-20 rounded-xl object-cover"
                />
                <div>
                  <p className="text-lg">{order.product.name}</p>
                  <p className="text-sm">Qty: {order.product.quantity}</p>
                  <p className="text-sm">
                    Amount: ₹
                    {order.product.boughtPrice * order.product.quantity}
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <div className="flex flex-col items-start justify-between gap-2">
            <p className="text-sm">
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p className="text-sm">Payment ID: {order.payment._id}</p>
            <p className="text-sm">Order ID: {order._id}</p>
          </div>
        </div>
        <div className="flex flex-col items-center self-start">
          {order.shiprocket.orderTrack?.scans.map((activity, index) => (
            <div
              key={activity.date.toString() + index}
              className="mb-4 flex items-center"
            >
              <div className="mr-4 h-2 w-2 rounded-full bg-green-500"></div>
              <div className="text-sm">
                <p className="font-semibold">{activity.activity}</p>
                <p className="text-gray-500">{activity.location}</p>
                <p className="text-gray-500">
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <IoClose
          className="absolute right-4 top-4 cursor-pointer"
          size={32}
          onClick={() => {
            setIsOpen(false)
          }}
        />
      </div>
    </Box>
  )
}

export default OrderCardModal
