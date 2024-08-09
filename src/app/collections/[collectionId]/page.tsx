'use client'
import Filter from '@/components/Collections/Filter'
import MobileFilter from '@/components/Collections/MobileFilter'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import Card from '@/components/Product/Card'
import { useProductContext } from '@/context/ProductContext'
import { FilterProps } from '@/types/collection'
import { Pagination } from '@mui/material'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface pageProps {
  params: {
    collectionId: string
  }
}

const limit = 32

const options = [
  { value: 'a-z', label: 'Alphabetically, A-Z' },
  { value: 'z-a', label: 'Alphabetically, Z-A' },
  { value: 'low-to-high', label: 'Price, low to high' },
  { value: 'high-to-low', label: 'Price, high to low' },
  { value: 'new-to-old', label: 'Date, new to old' },
  { value: 'old-to-new', label: 'Date, old to new' },
]

const Page: React.FC<pageProps> = ({ params }) => {
  const { collectionId } = params
  const { products, getTotalProducts, getCollectionProducts, sortProducts } =
    useProductContext()
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const [filter, setFilter] = useState<FilterProps>({
    availability: true,
    price: {
      min: 0,
      max: 100000,
    },
    discount: {
      min: 0,
      max: 100,
    },
    rating: {
      min: 0,
      max: 5,
    },
    colors: [] as string[],
    fabrics: [] as string[],
  })
  const [selectedSort, setSelectedSort] = useState<string>('')
  const search = useSearchParams()
  const [page, setPage] = useState<number>(
    search.has('page') ? parseInt(search.get('page')!) : 1,
  )

  useEffect(() => {
    if (search.has('filter')) {
      const tempFilter = JSON.parse(search.get('filter')!) as FilterProps
      setFilter({
        availability:
          typeof tempFilter.availability !== 'undefined'
            ? tempFilter.availability
            : true,
        price: {
          min:
            tempFilter.price && tempFilter.price.min ? tempFilter.price.min : 0,
          max:
            tempFilter.price && tempFilter.price.max
              ? tempFilter.price.max
              : 100000,
        },
        discount: {
          min:
            tempFilter.discount && tempFilter.discount.min
              ? tempFilter.discount.min
              : 0,
          max:
            tempFilter.discount && tempFilter.discount.max
              ? tempFilter.discount.max
              : 90,
        },
        rating: {
          min:
            tempFilter.rating && tempFilter.rating.min
              ? tempFilter.rating.min
              : 0,
          max:
            tempFilter.rating && tempFilter.rating.max
              ? tempFilter.rating.max
              : 5,
        },
        colors: tempFilter.colors ? tempFilter.colors : [],
        fabrics: tempFilter.fabrics ? tempFilter.fabrics : [],
      })
    }
  }, [])

  useEffect(() => {
    if (collectionId) {
      getCollectionProducts(collectionId, filter, page)
    }
  }, [collectionId, filter, page])

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="relative flex h-[200rem] min-h-screen w-[96vw] max-w-[80rem] gap-10 pt-10 max850:static">
        <Filter filter={filter} setFilter={setFilter} />
        <MobileFilter
          filter={filter}
          setFilter={setFilter}
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
        <div
          className="h-[100rem] w-[calc(100%-18rem)] max850:w-[96vw]"
          onClick={() => {
            setIsFilterOpen(false)
          }}
        >
          <div className="flex items-center justify-between border-b-[0.03rem] pb-2">
            <span className="font-light">{getTotalProducts} products</span>
            <div className="flex items-center gap-2">
              <p className="font-medium">Sort by</p>
              <div>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value)
                    sortProducts(e.target.value)
                  }}
                  className="rounded border border-gray-300 bg-transparent px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="" disabled>
                    Select an option
                  </option>
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
          </div>
          {/* <div className="flex flex-col items-center gap-2 py-10">
            <h4 className="text-2xl font-semibold">All Sarees</h4>
            <p className="px-10">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet,
              nostrum ipsam. Ad inventore aspernatur iste consequatur
              consectetur blanditiis ut eius praesentium. Quibusdam laborum
              minima eaque officiis quod officia. Quam, nisi!
            </p>
          </div> */}
          <ul className="mt-6 flex flex-wrap items-start justify-start gap-2 px-2 max850:justify-center max850:px-0">
            {products.map((product) => (
              <Card product={product} key={product._id + 'collection'} />
            ))}
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
      </div>
      <Footer />
    </div>
  )
}
8926025502
export default Page
