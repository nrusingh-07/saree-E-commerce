'use client'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import AdminOrderCard from '@/components/Order/AdminOrderCard'
import { useUserAuth } from '@/context/AuthContext'
import { useUtilContext } from '@/context/UtilContext'
import { AdminOrder } from '@/types/product'
import { Pagination } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'

const options = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price-low', label: 'Price Low' },
  { value: 'price-high', label: 'Price High' },
  { value: 'no-invoice', label: 'No Invoice' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'no-manifest', label: 'No Manifest' },
  { value: 'manifest', label: 'Manifest' },
  { value: 'no-label', label: 'No Label' },
  { value: 'label', label: 'Label' },
  { value: 'ship-pending', label: 'Ship Pending' },
  { value: 'ship-requested', label: 'Ship Requested' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
]

const limit = 20

const Page = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [getTotalOrders, setTotalOrders] = useState<number>(0)
  const [selectedSort, setSelectedSort] = useState<string>('newest')
  const [page, setPage] = useState<number>(1)
  const { setLoader } = useUtilContext()
  const { user, userData } = useUserAuth()

  useEffect(() => {
    const load = async () => {
      setLoader(true)
      try {
        const token = await user?.getIdToken()
        const res = await axios.get(
          `/api/admin/orders?sort=${selectedSort}&page=${page}`,
          {
            headers: {
              Authorization: 'Bearer ' + token,
            },
          },
        )
        setOrders(res.data.orders)
        setTotalOrders(res.data.totalOrders)
      } catch (e) {
        console.log(e)
      } finally {
        setLoader(false)
      }
    }
    if (user && userData?.isAdmin) load()
  }, [userData, user, page])

  const sortOrders = async (val: string) => {
    setLoader(true)
    try {
      const token = await user?.getIdToken()
      const res = await axios.get(
        `/api/admin/orders?sort=${val}&page=${page}`,
        {
          headers: {
            Authorization: 'Bearer ' + token,
          },
        },
      )
      setOrders(res.data.orders)
      setTotalOrders(res.data.totalOrders)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const updateOrder = (order: AdminOrder) => {
    setOrders((prev) => {
      return prev.map((o) => {
        if (o._id === order._id) {
          return order
        }
        return o
      })
    })
  }
  return (
    <div className="flex w-screen flex-col items-center">
      <DashboardHeader active="orders" />
      <div className="flex w-[96vw] max-w-[100rem] flex-col items-start pt-10">
        <div className="flex w-full justify-between pr-5">
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value)
                sortOrders(e.target.value)
              }}
              className="rounded border border-gray-300 bg-transparent px-4 py-2 focus:border-primary focus:outline-none"
            >
              {options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="font-light"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <ul className="flex flex-col gap-2">
            {orders &&
              orders.map((order) => (
                <AdminOrderCard
                  key={order._id + 'orderadmin' + order.paymentId._id}
                  order={order}
                  updateOrder={updateOrder}
                />
              ))}
          </ul>
          <div className="mt-10 flex items-center justify-center mb-4">
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
    </div>
  )
}

export default Page
