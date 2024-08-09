'use client'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Card from '@/components/Product/Card'
import { ProductType } from '@/types/user'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { GoSearch } from 'react-icons/go'

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([])
  const search = useSearchParams()
  const [q, setQ] = useState<string>('')

  useEffect(() => {
    const getProducts = async () => {
      try {
        setQ(search.get('q')!)
        const res = await axios.get(
          `/api/user/search${search.get('q') ? `?q=${search.get('q')}` : ''}`,
        )
        setProducts(res.data.products)
      } catch (e) {
        console.log(e)
      }
    }
    getProducts()
  }, [])

  const onSearch = async (e: any) => {
    e.preventDefault()
    try {
      const res = await axios.get(
        `/api/user/search${search.get('q') ? `?q=${search.get('q')}` : ''}`,
      )
      setProducts(res.data.products)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="flex min-h-[50rem] w-[96vw] max-w-[84rem] flex-col items-center gap-5 pb-10">
        <h5 className="mt-1 text-4xl">Search</h5>
        <div className="mb-10 flex flex-col items-center gap-2 max850:justify-center">
          <p className="text-lg">
            {products.length} results for "{q}"
          </p>
          <form className="max500:flex max500:w-[90vw]">
            <input
              type="text"
              placeholder="Search"
              value={q ? q : ''}
              onChange={(e) => {
                setQ(e.target.value)
              }}
              className="h-10 rounded-l-full border-[0.02rem] border-primary px-10 py-2 focus:outline-none max500:w-[80%] max500:rounded-sm"
            />
            <button
              onClick={onSearch}
              className={` w-24 rounded-r-full bg-primary py-2 pl-5 pr-10 text-white max500:hidden`}
            >
              Submit
            </button>
            <button
              onClick={onSearch}
              className={`bg-primary text-white max500:flex max500:w-[20%] max500:items-center max500:justify-center max500:rounded-r-sm max500:p-1 min500:hidden`}
            >
              <GoSearch size={'1.5rem'} />
            </button>
          </form>
        </div>
        <ul className="flex flex-wrap justify-center gap-3">
          {products.map((product) => (
            <Card product={product} key={product._id + 'search'} />
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  )
}

export default Page
