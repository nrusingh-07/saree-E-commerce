'use client'
import { useProductContext } from '@/context/ProductContext'
import { ProductType } from '@/types/user'
import { useState } from 'react'
import { MdDelete } from 'react-icons/md'

interface CardProps {
  product: ProductType
  quantity: number
}

const Card: React.FC<CardProps> = ({ product, quantity }) => {
  const [newQuantity, setNewQuantity] = useState(quantity)
  const { removeFromCart, changeCartQuantity } = useProductContext()
  return (
    <li className="flex gap-1">
      <img
        src={product.images[0]}
        alt={product.name}
        className="h-40 w-40 border-[0.02rem] object-cover p-[0.09rem]"
      />
      <div className="flex w-[30rem] flex-col justify-between px-2 py-1 ">
        <div className="flex flex-col">
          <p className="line-clamp-2 max-h-16 max-w-xs overflow-hidden whitespace-normal px-2 font-medium max500:text-sm">
            {product.name}
          </p>
          <p className="text-sm">Color: {product.color}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex">
            {newQuantity <= 1 ? (
              <span
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-[0.02rem] max500:h-8 max500:w-8"
                onClick={() => {
                  removeFromCart(product._id)
                }}
              >
                <MdDelete className="text-xl max500:text-base" />
              </span>
            ) : (
              <span
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-[0.02rem] text-2xl max500:h-8 max500:w-8 max500:text-lg"
                onClick={() => {
                  changeCartQuantity(product._id, newQuantity - 1)
                  setNewQuantity((p) => {
                    return p - 1
                  })
                }}
                style={{
                  userSelect: 'none',
                }}
              >
                -
              </span>
            )}
            <p className="flex h-10 max-w-20 items-center justify-center px-4 max500:h-8 max500:w-8">
              {newQuantity}
            </p>
            <span
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border-[0.02rem] text-2xl max500:h-8 max500:w-8 max500:text-lg"
              onClick={() => {
                changeCartQuantity(product._id, newQuantity + 1)
                setNewQuantity((p) => {
                  return p + 1
                })
              }}
              style={{
                userSelect: 'none',
              }}
            >
              +
            </span>
          </div>
          <p className="text-sm">₹{quantity * product.discountedPrice}</p>
        </div>
      </div>
    </li>
  )
}

export default Card
