import { auth } from '@/config/Firebase'
import { useUserAuth } from '@/context/AuthContext'
import { Address, CartItem, ProductType } from '@/types/user'
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import PrimaryButton from '../Buttons/PrimaryButton'
import { IoClose } from 'react-icons/io5'

interface PaymentModalProps {
  isCart: boolean
  productQuan?: {
    product: ProductType
    quantity: number
  }
  setIsBuy: React.Dispatch<React.SetStateAction<boolean>>
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isCart,
  productQuan,
  setIsBuy,
}) => {
  const { userData } = useUserAuth()
  const [loading, setLoader] = useState<boolean>(false)
  const [isBillShipSame, setIsBillShipSame] = useState<boolean>(false)
  const [billingAddress, setBillingAddress] = useState<Address>({
    name: userData?.firstName + ' ' + userData?.lastName,
    street: '',
    city: '',
    country: '',
    postalCode: '',
    state: '',
    phoneNumber: userData?.phoneNumber?.slice(-10) || '',
    email: userData?.email || '',
  })
  const [shippingAddress, setShippingAddress] = useState<Address>({
    name: userData?.firstName + ' ' + userData?.lastName,
    street: '',
    city: '',
    country: '',
    postalCode: '',
    state: '',
    phoneNumber: userData?.phoneNumber?.slice(-10) || '',
    email: userData?.email || '',
  })
  const router = useRouter()

  useEffect(() => {
    if (userData) {
      if (userData.address) {
        if (userData.address.billing && userData.address.shipping) {
          if (typeof userData.address.billing !== 'string') {
            setBillingAddress(userData.address.billing)
          }
          if (typeof userData.address.shipping !== 'string') {
            setShippingAddress(userData.address.shipping)
          }
        }
      }
      setBillingAddress((prev) => ({
        ...prev,
        phoneNumber: userData.phoneNumber?.slice(-10) || '',
        email: userData.email || '',
      }))
      setShippingAddress((prev) => ({
        ...prev,
        phoneNumber: userData.phoneNumber?.slice(-10) || '',
        email: userData.email || '',
      }))
    }
  }, [userData])

  const handleChange = (field: string, value: string, addressType: string) => {
    if (addressType === 'billing') {
      setBillingAddress((prev) => ({ ...prev, [field]: value }))
    } else if (addressType === 'shipping') {
      setShippingAddress((prev) => ({ ...prev, [field]: value }))
    }
  }

  const totalAmount = () => {
    if (isCart) {
      let amount = 0
      userData?.cart?.items.forEach((item) => {
        amount +=
          ((item as CartItem).productId as ProductType).discountedPrice *
          (item as CartItem).quantity
      })
      return amount
    } else {
      if (productQuan?.product && productQuan?.quantity)
        return productQuan?.product.discountedPrice * productQuan?.quantity
      else return 0
    }
  }

  const validateAddress = () => {
    if (
      billingAddress.city &&
      billingAddress.country &&
      billingAddress.name &&
      billingAddress.postalCode &&
      billingAddress.street &&
      billingAddress.state
    ) {
      if (
        isBillShipSame ||
        (shippingAddress.city &&
          shippingAddress.country &&
          shippingAddress.name &&
          shippingAddress.postalCode &&
          shippingAddress.street &&
          shippingAddress.state)
      ) {
        if (
          billingAddress.email &&
          billingAddress.phoneNumber &&
          (isBillShipSame ||
            (shippingAddress.email && shippingAddress.phoneNumber))
        ) {
          if (
            billingAddress.phoneNumber.length === 10 &&
            (isBillShipSame || shippingAddress.phoneNumber.length === 10)
          ) {
            if (
              billingAddress.email.includes('@') &&
              (isBillShipSame || shippingAddress.email.includes('@'))
            ) {
              return true
            } else return false
          } else return false
        } else return false
      } else return false
    } else return false
  }

  const buyNow = async () => {
    if (!validateAddress()) {
      alert('Fill it Properly')
      return
    }
    setLoader(true)
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken()
        let res
        if (isCart) {
          res = await axios.post(
            '/api/user/checkout/cart',
            {
              billingAddress,
              shippingAddress: isBillShipSame
                ? billingAddress
                : shippingAddress,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        } else {
          res = await axios.post(
            '/api/user/checkout',
            {
              productId: productQuan?.product._id,
              quantity: productQuan?.quantity,
              billingAddress,
              shippingAddress: isBillShipSame
                ? billingAddress
                : shippingAddress,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
        }
        const url = res.data.payment.url
        if (url) {
          setLoader(false)
          window.location.href = url
        }
      } else {
        setLoader(false)
        router.push('/login')
      }
    } catch (e) {
      console.log(e)
      setLoader(false)
    }
  }
  return (
    <Box className="fixed left-1/2 top-1/2 h-auto w-auto  -translate-x-1/2 -translate-y-1/2 transform overflow-auto rounded-md bg-white p-6 shadow-md max850:h-[90vh] max850:w-[90vw] ">
      <IoClose
        className="absolute right-2 top-2 cursor-pointer"
        size={'2rem'}
        color="grey"
        onClick={() => {
          setIsBuy(false)
        }}
      />
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          1<Typography variant="h5">Billing Address</Typography>
          <div className="flex flex-wrap gap-3">
            <TextField
              label="Name"
              value={billingAddress.name}
              onChange={(e) => handleChange('name', e.target.value, 'billing')}
              className="mt-2"
            />
            <TextField
              label="Street"
              value={billingAddress.street}
              onChange={(e) =>
                handleChange('street', e.target.value, 'billing')
              }
              className="mt-2"
            />
            <TextField
              label="City"
              value={billingAddress.city}
              onChange={(e) => handleChange('city', e.target.value, 'billing')}
              className="mt-2"
            />
            <TextField
              label="State"
              value={billingAddress.state}
              onChange={(e) => handleChange('state', e.target.value, 'billing')}
              className="mt-2"
            />
            <TextField
              label="Postal Code"
              value={billingAddress.postalCode}
              onChange={(e) =>
                handleChange('postalCode', e.target.value, 'billing')
              }
              className="mt-2"
            />
            <TextField
              label="Country"
              value={billingAddress.country}
              onChange={(e) =>
                handleChange('country', e.target.value, 'billing')
              }
              className="mt-2"
            />
            <TextField
              label="Phone Number"
              value={billingAddress.phoneNumber}
              onChange={(e) =>
                handleChange('phoneNumber', e.target.value, 'billing')
              }
              className="mt-2"
            />
            <TextField
              label="Email"
              value={billingAddress.email}
              onChange={(e) => handleChange('email', e.target.value, 'billing')}
              className="mt-2"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-end gap-3">
            <Typography variant="h5" className="mt-4">
              Shipping Address
            </Typography>
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isBillShipSame}
                onChange={(e) => {
                  setIsBillShipSame(e.target.checked)
                }}
              />
              <p>Same as Shipping</p>
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <TextField
              label="Name"
              value={
                isBillShipSame ? billingAddress.name : shippingAddress.name
              }
              onChange={(e) => handleChange('name', e.target.value, 'shipping')}
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="Street"
              value={
                isBillShipSame ? billingAddress.street : shippingAddress.street
              }
              onChange={(e) =>
                handleChange('street', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="City"
              value={
                isBillShipSame ? billingAddress.city : shippingAddress.city
              }
              onChange={(e) => handleChange('city', e.target.value, 'shipping')}
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="State"
              value={
                isBillShipSame ? billingAddress.state : shippingAddress.state
              }
              onChange={(e) =>
                handleChange('state', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="Postal Code"
              value={
                isBillShipSame
                  ? billingAddress.postalCode
                  : shippingAddress.postalCode
              }
              onChange={(e) =>
                handleChange('postalCode', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="Country"
              value={
                isBillShipSame
                  ? billingAddress.country
                  : shippingAddress.country
              }
              onChange={(e) =>
                handleChange('country', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="Phone Number"
              value={shippingAddress.phoneNumber}
              onChange={(e) =>
                handleChange('phoneNumber', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
            <TextField
              label="Email"
              value={shippingAddress.email}
              onChange={(e) =>
                handleChange('email', e.target.value, 'shipping')
              }
              className="mt-2"
              disabled={isBillShipSame}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p>Total Price:</p>
          <p>₹{totalAmount()}</p>
        </div>
        {loading ? (
          <CircularProgress />
        ) : (
          <PrimaryButton func={buyNow} content="Buy Now" />
        )}
      </div>
    </Box>
  )
}

export default PaymentModal
