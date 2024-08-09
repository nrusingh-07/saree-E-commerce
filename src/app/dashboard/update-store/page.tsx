'use client'
import PrimaryButton from '@/components/Buttons/PrimaryButton'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import { usePathname, useRouter } from 'next/navigation'
import { Modal, Pagination } from '@mui/material'
import { GoSearch } from 'react-icons/go'
import { useEffect, useState } from 'react'
import { useUserAuth } from '@/context/AuthContext'
import ProductAddModal from '@/components/Dashboard/ProductAddModal'
import axios from 'axios'
import { ProductType } from '@/types/user'
import ProductItem from '@/components/Dashboard/ProductItem'
import ProductEditModal from '@/components/Dashboard/ProductEditModal'
import { useUtilContext } from '@/context/UtilContext'

const limit = 50

const Page = () => {
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductType | null>(null)
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<ProductType[]>([])
  const [similarProduct, setSimilarProduct] = useState<ProductType | null>()
  const [getTotalProducts, setGetTotalProducts] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const { setLoader } = useUtilContext()
  const { user, userData } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && userData?.isAdmin) getProducts('', 'load')
  }, [user, page])

  const getProducts = async (search: string, isLoader?: string) => {
    try {
      if (isLoader) setLoader(true)
      const token = await user?.getIdToken()
      const res = await axios.get(
        `/api/admin/product?search=${search}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setProducts(res.data.products)
      setGetTotalProducts(res.data.totalProducts)
    } catch (e) {
      console.log(e)
    } finally {
      if (isLoader) setLoader(false)
    }
  }

  const onProductEdit = async (product: ProductType) => {
    try {
      setEditOpen(true)
      setEditProduct(product)
    } catch (e) {
      console.log(e)
    }
  }

  const setEditProductFn = (p: ProductType) => {
    setProducts((prev) => {
      return prev.map((product) => {
        if (product._id === p._id) {
          return p
        }
        return product
      })
    })
  }

  const setAddProductFn = (p: ProductType) => {
    setProducts((prev) => {
      return [...prev, p]
    })
  }

  const addProduct = async () => {
    setAddOpen(true)
  }

  const addSimilarProduct = async (p: ProductType) => {
    try {
      setEditOpen(false)
      setSimilarProduct({
        _id: '',
        availability: true,
        isCelebrity: false,
        brand: p.brand,
        color: '',
        colors: p.colors,
        createdDate: '',
        description: p.description,
        collections: p.collections,
        discount: p.discount,
        fabric: p.fabric,
        images: [],
        name: p.name,
        occasion: p.occasion,
        price: p.price,
        discountedPrice: p.discountedPrice,
        quantity: p.quantity,
        ratings: [],
        similarity: p.similarity,
        size: p.size,
        weight: p.weight,
      })
      setAddOpen(true)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      <DashboardHeader active={usePathname().split('/dashboard/')[1]} />
      <div className="mt-7 min-h-screen w-[90%]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-md bg-slate-300 px-2">
            <GoSearch />
            <input
              type="text"
              placeholder="Search"
              value={search}
              className="h-10 rounded-md bg-transparent focus:outline-none"
              onChange={(e) => {
                setSearch(e.target.value)
                getProducts(e.target.value)
              }}
            />
          </div>
          <PrimaryButton
            content="Add New Product"
            func={addProduct}
            className="px-2"
          />
        </div>
        <ul className="my-10 flex flex-wrap gap-6 max850:gap-4">
          {products.map((product) => {
            return (
              <ProductItem
                product={product}
                key={product._id}
                onProductEdit={onProductEdit}
              />
            )
          })}
        </ul>
        <div className="mt-10 flex items-center justify-center">
          <Pagination
            count={Math.ceil(getTotalProducts / limit)}
            page={page}
            onChange={(event, value) => {
              setPage(value)
            }}
          />
        </div>
      </div>
      <Modal
        open={addOpen}
        onClose={() => {
          setAddOpen(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <ProductAddModal
            setAddOpen={setAddOpen}
            p={similarProduct!}
            setAddProductFn={setAddProductFn}
          />
        </div>
      </Modal>
      <Modal
        open={editOpen}
        onClose={() => {
          setEditOpen(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <ProductEditModal
            p={editProduct!}
            addSimilarProduct={addSimilarProduct}
            setEditOpen={setEditOpen}
            setEditProductFn={setEditProductFn}
          />
        </div>
      </Modal>
    </div>
  )
}

export default Page
