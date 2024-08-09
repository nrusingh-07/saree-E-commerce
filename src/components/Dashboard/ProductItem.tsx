import { ProductType } from '@/types/user'

interface ProductItemProps {
  product: ProductType
  onProductEdit: (product: ProductType) => void
}

const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onProductEdit,
}) => {
  return (
    <li
      className="flex h-[20rem] w-64 cursor-pointer flex-col gap-2 rounded-md bg-cardBg pb-2 shadow-md max1250:h-[16rem] max1250:w-48 max500:w-[42vw]"
      onClick={() => {
        onProductEdit(product)
      }}
    >
      <img
        src={product.images[0]}
        alt=""
        className="h-[70%] w-full rounded-t-md object-cover"
      />
      <div className="flex h-[30%] flex-col justify-between">
        <h4 className="line-clamp-2 max-h-16 max-w-xs overflow-hidden whitespace-normal px-2 text-sm">
          {product.name}
        </h4>
        <span>
          <span className="px-2 text-xl font-light text-gray-500 line-through">
            ₹{product.price}
          </span>
          <span className="px-2 text-xl font-semibold text-primary">
            ₹{product.discountedPrice}
          </span>
        </span>
        <p className="items-end px-2 font-sans text-gray-500">
          {product.brand}
        </p>
      </div>
    </li>
  )
}

export default ProductItem
