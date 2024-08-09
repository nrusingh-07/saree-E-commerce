'use client'

import { auth } from '@/config/Firebase'
import axios from 'axios'
import { createContext, useContext, useState } from 'react'
import { useUserAuth } from './AuthContext'
import { useUtilContext } from './UtilContext'
import { Order } from '@/types/product'

interface OrderContextProps {
  orders: Order[]
  setOrders: React.Dispatch<React.SetStateAction<any[]>>
  getAllOrders: (page: number) => void
  getTotalOrders: number
}

export const OrderContext = createContext<OrderContextProps>(null!)

interface OrderContextProviderProps {
  children: React.ReactNode
}

export const OrderContextProvider: React.FC<OrderContextProviderProps> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [getTotalOrders, setGetTotalOrders] = useState<number>(0)
  const { user } = useUserAuth()
  const { setLoader } = useUtilContext()

  const getAllOrders = async (page: number) => {
    try {
      setLoader(true)
      const token = await user?.getIdToken()
      if (!token) throw new Error('Token not found')
      const res = await axios.get(`/api/user/orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setOrders(res.data.orders)
      setGetTotalOrders(res.data.totalOrders)
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  return (
    <OrderContext.Provider
      value={{
        orders,
        setOrders,
        getAllOrders,
        getTotalOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export const useOrderContext = () => {
  return useContext(OrderContext)
}
