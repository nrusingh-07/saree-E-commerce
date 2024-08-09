'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import OrderCard from '@/components/Order/OrderCard'
import { useUserAuth } from '@/context/AuthContext'
import { useOrderContext } from '@/context/OrderContext'
import { Pagination } from '@mui/material'
import Link from 'next/link'
import React, { useEffect } from 'react'

const limit = 10

const Page = () => {
  const [page, setPage] = React.useState<number>(1)
  const { user } = useUserAuth()
  const { getAllOrders, orders, getTotalOrders } = useOrderContext()

  useEffect(() => {
    if (user) {
      getAllOrders(page)
    }
  }, [user, page])

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="flex min-h-screen w-[98vw] max-w-[90rem] flex-col items-center gap-2">
        <div className="flex w-full items-center justify-between pt-12">
          <span className="flex items-end gap-2">
            <h5 className="text-3xl">Your Orders</h5>
            <p>({orders.length} item)</p>
          </span>
          <Link href="/collections/all">
            <p className="border-b-[0.02rem] font-light">Continue Shopping</p>
          </Link>
        </div>
        <ul className="flex w-[100%] flex-wrap justify-start gap-4 max1000:flex-col">
          {orders.map((order, i) => (
            <OrderCard order={order} key={order._id + 'order' + i.toString()} />
          ))}
        </ul>
        <div className="mt-10 flex items-center justify-center">
          <Pagination
            count={Math.ceil(getTotalOrders / limit)}
            page={page}
            onChange={(event, value) => {
              setPage(value)
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Page
