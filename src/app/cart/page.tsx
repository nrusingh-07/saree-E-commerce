'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import Card from '@/components/Cart/Card'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import PaymentModal from '@/components/Order/PaymentModal'
import { useUserAuth } from '@/context/AuthContext'
import { CartItem, ProductType } from '@/types/user'
import { Modal } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
  const [isBuy, setIsBuy] = useState(false)
  const { user, userData } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    // if (!user) {
    //   router.push('/login')
    // }
  }, [user])

  const checkout = async () => {
    if (user) {
      setIsBuy(true)
    } else {
      router.push('/login')
    }
  }
  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="mb-[10rem] flex min-h-60 w-[90vw] max-w-[70rem] flex-col items-center gap-3">
        <div className="flex w-full items-center justify-between pt-12">
          <span className="flex items-end gap-2">
            <h5 className="text-3xl">Your Cart</h5>
            <p>({userData?.cart.totalItems} item)</p>
          </span>
          <Link href="/collections/all">
            <p className="border-b-[0.02rem] font-light">Continue Shopping</p>
          </Link>
        </div>
        <div className="flex w-full max850:flex-col max850:gap-10">
          <ul className="flex w-[50rem] flex-col gap-3  max850:w-[90vw]">
            {userData?.cart.items.map((item) => {
              const product = (item as CartItem).productId as ProductType
              const quantity = (item as CartItem).quantity
              return (
                <Card
                  product={product}
                  key={product._id + product.name}
                  quantity={quantity}
                />
              )
            })}
          </ul>
          <div className="flex h-[6rem] w-[30rem] flex-col items-center justify-between bg-cardBg p-2 px-7 py-2 max850:w-[20rem] max500:w-[90vw]">
            <div className="flex w-full justify-between">
              <p>SUBTOTAL</p>
              <p>₹ {userData?.cart.totalPrice}</p>
            </div>
            <PrimaryButton
              content="CHECKOUT"
              func={checkout}
              className="w-full rounded-3xl"
            />
          </div>
        </div>
      </div>
      <Footer />
      {user && (
        <Modal
          open={isBuy}
          onClose={() => {
            setIsBuy(false)
          }}
          aria-labelledby="payment"
          aria-describedby="payment"
        >
          <PaymentModal isCart={true} setIsBuy={setIsBuy} />
        </Modal>
      )}
    </div>
  )
}

export default Page
