import { AdminOrder } from '@/types/product'
import { Box } from '@mui/material'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'
import { IoClose } from 'react-icons/io5'
import { useUserAuth } from '@/context/AuthContext'
import axios from 'axios'

interface AdminOrderCardModalProps {
  order: AdminOrder
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  shipRequestFn: () => void
  labelFn: () => void
  manifestFn: () => void
  invoiceFn: () => void
  cancelOrderFn: () => void
}

const AdminOrderCardModal: React.FC<AdminOrderCardModalProps> = ({
  invoiceFn,
  labelFn,
  manifestFn,
  order,
  setIsOpen,
  shipRequestFn,
  cancelOrderFn,
}) => {
  const { user } = useUserAuth()
  const openLink = (url: string) => {
    window.open(url, '_blank')
    return
  }

  const paymentStatusFn = async () => {
    try {
      const token = await user?.getIdToken()
      const res = await axios.get(`/api/admin/orders/${order._id}/payment`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      console.log(res.data)
    } catch (e) {
      console.log(e)
    }
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
          <div
            className="flex items-center gap-4"
            // onClick={() => {
            //   router.push(`/product/${product._id}`)
            // }}
          >
            <div>
              <h5
                className="line-clamp-1 max-h-16 max-w-xs overflow-hidden whitespace-normal text-xl"
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                {order.userId.firstName + ' ' + order.userId.lastName}
              </h5>
              <p>₹{order.paymentId.amount}</p>
              <p className="text-sm">No of Types: {order.products.length}</p>
            </div>
          </div>
          <ul className="flex flex-col gap-1">
            {order.products.map((product) => (
              <li key={product.productId._id}>
                <div className="flex items-center gap-4">
                  <img
                    src={product.productId.images[0]}
                    alt={product.productId.name}
                    className="h-28 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <p className="text-lg">{product.productId.name}</p>
                    <p className="text-sm">Qty: {product.quantity}</p>
                    <p className="text-sm">
                      Amount: ₹{product.price * product.quantity}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start justify-between gap-2">
            <p className="text-sm">
              {new Date(order.orderDate).toLocaleString()}
            </p>
            <p className="text-sm">Payment ID: {order.paymentId._id}</p>
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
        <div className="flex flex-col gap-1">
          <LightPrimaryButton
            content={
              order.shiprocket.invoice ? 'View Invoice' : 'Generate Invoice'
            }
            func={
              order.shiprocket.invoice
                ? () => openLink(order.shiprocket.invoice)
                : invoiceFn
            }
            className="w-40 max500:w-[100%]"
          />
          <LightPrimaryButton
            content="Request Ship"
            func={shipRequestFn}
            className="w-40 max500:w-[100%]"
          />
          <LightPrimaryButton
            content={
              order.shiprocket.manifested && order.shiprocket.manifestLink
                ? 'View Manifest'
                : 'Generate Manifest'
            }
            func={
              order.shiprocket.manifested && order.shiprocket.manifestLink
                ? () => openLink(order.shiprocket.manifestLink)
                : manifestFn
            }
            className="w-40 max500:w-[100%]"
          />
          <LightPrimaryButton
            content={order.shiprocket.label ? 'View Label' : 'Generate Label'}
            func={
              order.shiprocket.label
                ? () => openLink(order.shiprocket.label)
                : labelFn
            }
            className="w-40 max500:w-[100%]"
          />
          {/* <LightPrimaryButton
            content={'Cancel Order'}
            func={cancelOrderFn}
            className="w-40 max500:w-[100%]"
          />
          <LightPrimaryButton
            content={'Payment Status'}
            func={paymentStatusFn}
            className="w-40 max500:w-[100%]"
          /> */}
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

export default AdminOrderCardModal
