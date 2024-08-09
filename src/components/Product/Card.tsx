import { ProductType } from '@/types/user'
import React from 'react'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'
import { useProductContext } from '@/context/ProductContext'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/Firebase'

interface CardProps {
  product: ProductType
}

export const Card: React.FC<CardProps> = ({ product }) => {
  const { addToCart } = useProductContext()
  const router = useRouter()
  const check = 6
  return (
    <li className="flex w-[13rem] flex-col justify-between rounded-md bg-cardBg pb-2 max500:h-[calc(50vw+12rem)] max500:w-[40vw] max300:w-[96vw]">
      <div className="flex flex-col gap-1">
        <img
          src={product.images[0]}
          alt=""
          className="h-[17rem] w-[100%] rounded-md object-cover max500:h-[58vw]"
          onClick={() => router.push(`/product/${product._id}`)}
        />
        <p className="line-clamp-2 max-h-16 max-w-xs overflow-hidden whitespace-normal px-2">
          {product.name}
        </p>
      </div>
      <div className="flex flex-col items-center">
        <div className="border-b-[0.02rem] pb-1 pt-2">
          <span className="px-1 font-semibold text-primary max500:text-sm">
            ₹{product.discountedPrice}
          </span>
          <span className="px-1 text-xs font-thin text-gray-500 line-through">
            ₹{product.price}
          </span>
          <span className="px-1 text-xs font-light text-red-500">
            ({product.discount}% OFF)
          </span>
        </div>
        <LightPrimaryButton
          content="ADD TO CART"
          func={async () => {
            if (auth.currentUser) addToCart(product._id)
            else router.push('/login')
          }}
          className="w-[90%]"
        />
      </div>
    </li>
  )
}

export default Card
