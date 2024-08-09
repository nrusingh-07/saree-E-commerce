import { ProductType } from '@/types/user'
import React from 'react'
import Card from '../Product/Card'
import PrimaryButton from '../Buttons/PrimaryButton'
import { useRouter } from 'next/navigation'

interface CelebrityListProps {
  products: ProductType[]
}

const CelebrityList: React.FC<CelebrityListProps> = ({ products }) => {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xl font-semibold">CELEBRITY CHOICE</p>
      <ul className="flex flex-wrap justify-between gap-5">
        {products.map((product) => (
          <Card key={product._id} product={product} />
        ))}
      </ul>
      <PrimaryButton
        content="View All"
        func={() => {
          router.push('/collections/celeb-sarees')
        }}
        className="mt-10 h-10 w-48 rounded-full"
      />
    </div>
  )
}

export default CelebrityList
