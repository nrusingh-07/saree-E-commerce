'use client'

import { auth } from '@/config/Firebase'
import axios from 'axios'
import { createContext, useContext, useState } from 'react'
import { useUserAuth } from './AuthContext'
import { useUtilContext } from './UtilContext'
import { ProductType } from '@/types/user'
import { FilterProps } from '@/types/collection'

interface ProductContextProps {
  addToCart: (productId: string, quantity?: number) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  changeCartQuantity: (productId: string, quantity: number) => Promise<void>
  getCollectionProducts: (
    collectionId: string,
    filter: FilterProps,
    page: number,
  ) => Promise<void>
  getTotalProducts: number
  sortProducts: (sort: string) => void
  products: ProductType[]
  colorOptions: {
    color: string
    noOfProducts: string
  }[]
  fabricOptions: {
    fabric: string
    noOfProducts: string
  }[]
}

export const ProductContext = createContext<ProductContextProps>(null!)

interface ProductContextProviderProps {
  children: React.ReactNode
}

export const ProductContextProvider: React.FC<ProductContextProviderProps> = ({
  children,
}) => {
  const [products, setProducts] = useState<ProductType[]>([])
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const [colorOptions, setColorOptions] = useState<
    {
      color: string
      noOfProducts: string
    }[]
  >([])
  const [fabricOptions, setFabricOptions] = useState<
    {
      fabric: string
      noOfProducts: string
    }[]
  >([])
  const [collectionID, setCollectionID] = useState<string>('')
  const { setUserDataFromToken } = useUserAuth()
  const { setLoader } = useUtilContext()

  const addToCart = async (productId: string, quantity?: number) => {
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error('Token not found')
      await axios.post(
        '/api/user/cart',
        {
          productId,
          quantity: quantity || 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      await setUserDataFromToken()
    } catch (e) {
      console.log(e)
    }
  }

  const removeFromCart = async (productId: string) => {
    setLoader(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error('Token not found')
      await axios.delete(`/api/user/cart?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      await setUserDataFromToken()
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const changeCartQuantity = async (productId: string, quantity: number) => {
    setLoader(true)
    try {
      const token = await auth.currentUser?.getIdToken()
      if (!token) throw new Error('Token not found')
      await axios.put(
        `/api/user/cart?productId=${productId}`,
        {
          productId,
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      await setUserDataFromToken()
    } catch (e) {
      console.log(e)
    } finally {
      setLoader(false)
    }
  }

  const getCollectionProducts = async (
    collectionId: string,
    filter: FilterProps,
    page: number,
  ) => {
    setLoader(true)
    try {
      const res = await axios.get(
        `/api/user/collections/${collectionId}?filter=${JSON.stringify(filter)}&page=${page}`,
      )
      setCollectionID(collectionId)

      if (collectionID === collectionId) {
        setProducts(res.data.products)
        return
      }
      const prods = res.data.products as ProductType[]
      const colors = prods.map((prod) => prod.color)
      const fabrics = prods.map((prod) => prod.fabric)
      const colorSet = new Set(colors)
      const fabricSet = new Set(fabrics)
      const colorArr = Array.from(colorSet)
      const fabricArr = Array.from(fabricSet)
      const colorOptions = colorArr.map((color) => ({
        color,
        noOfProducts: colors.filter((c) => c === color).length.toString(),
      }))
      const fabricOptions = fabricArr.map((fabric) => ({
        fabric,
        noOfProducts: fabrics.filter((f) => f === fabric).length.toString(),
      }))
      setColorOptions(colorOptions)
      setFabricOptions(fabricOptions)

      setProducts(prods)
      setTotalProducts(res.data.totalProducts)
    } catch (e) {
      console.log(e)
      setProducts([])
      setTotalProducts(0)
    } finally {
      setLoader(false)
    }
  }

  const sortProducts = (sort: string) => {
    switch (sort) {
      case 'a-z':
        setProducts(products.sort((a, b) => a.name.localeCompare(b.name)))
        break
      case 'z-a':
        setProducts(products.sort((a, b) => b.name.localeCompare(a.name)))
        break
      case 'low-to-high':
        setProducts(
          products.sort((a, b) => a.discountedPrice - b.discountedPrice),
        )
        break
      case 'high-to-low':
        setProducts(
          products.sort((a, b) => b.discountedPrice - a.discountedPrice),
        )
        break
      case 'new-to-old':
        setProducts(
          products.sort(
            (a, b) =>
              new Date(b.createdDate).getTime() -
              new Date(a.createdDate).getTime(),
          ),
        )
        break
      case 'old-to-new':
        setProducts(
          products.sort(
            (a, b) =>
              new Date(a.createdDate).getTime() -
              new Date(b.createdDate).getTime(),
          ),
        )
        break
      default:
        break
    }
  }

  return (
    <ProductContext.Provider
      value={{
        addToCart,
        removeFromCart,
        changeCartQuantity,
        getCollectionProducts,
        getTotalProducts: totalProducts,
        sortProducts,
        products,
        colorOptions,
        fabricOptions,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  return useContext(ProductContext)
}
