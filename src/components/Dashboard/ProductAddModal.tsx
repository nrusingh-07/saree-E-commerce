import {
  colorOptions,
  fabricOptions,
  sareeCollectionsArray,
} from '@/Static/Product'
import { ProductType } from '@/types/user'
import { Box, CircularProgress, colors } from '@mui/material'
import React, { useState } from 'react'
import PrimaryButton from '../Buttons/PrimaryButton'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/config/Firebase'
import axios from 'axios'
import { useUserAuth } from '@/context/AuthContext'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'

interface ProductEditModalProps {
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>
  p?: ProductType
  setAddProductFn: (p: ProductType) => void
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({
  setAddOpen,
  p,
  setAddProductFn,
}) => {
  const [product, setProduct] = useState<ProductType>(
    p
      ? p
      : {
          _id: '',
          availability: true,
          isCelebrity: false,
          brand: '',
          color: colorOptions[0].name,
          colors: [colorOptions[0].name],
          createdDate: '',
          description: '',
          discount: 0,
          fabric: fabricOptions[0].value,
          collections: [],
          images: [],
          name: '',
          occasion: '',
          price: 0,
          discountedPrice: 0,
          quantity: 0,
          ratings: [],
          similarity: '',
          size: '',
          weight: 0,
        },
  )
  const [newImages, setNewImages] = useState<File[]>([])
  const [activeImage, setActiveImage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useUserAuth()

  const handleCheckboxChange = (event: any) => {
    const { value } = event.target
    if (product.collections.includes(value)) {
      setProduct((p) => {
        return {
          ...p,
          collections: p.collections.filter((item) => item !== value),
        }
      })
    } else {
      setProduct((p) => {
        return {
          ...p,
          collections: [...p.collections, value],
        }
      })
    }
  }

  const createProduct = async () => {
    setIsLoading(true)
    try {
      const token = await user?.getIdToken()
      const data = await axios.post(`/api/admin/product`, product, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProduct(data.data.product)

      let urls: (string | null)[] = []
      if (newImages.length > 0) {
        urls = (await handleUploadImages(data.data.product._id)) || []
      }

      const res = await axios.put(
        `/api/admin/product`,
        {
          ...product,
          _id: data.data.product._id,
          images: [...urls],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log(res)
      setAddProductFn(res.data.product)
    } catch (e) {
      console.log(e)
    } finally {
      setAddOpen(false)
      setIsLoading(false)
    }
  }

  const handleUploadImages = async (id: string) => {
    try {
      setIsLoading(true)

      const uploadPromises = []

      for (const file of newImages) {
        const storageRef = ref(
          storage,
          `images/${id}/${Math.random() * 100000000}${Date.now()}${file.name}`,
        )

        const uploadPromise = uploadBytes(storageRef, file)
          .then(() => getDownloadURL(storageRef))
          .catch((error) => {
            console.error(`Error uploading file ${file.name}:`, error)
            return null
          })

        uploadPromises.push(uploadPromise)
      }

      const urls = await Promise.all(uploadPromises)

      return urls
    } catch (e) {
      console.error('Error during image upload:', e)
    } finally {
      setIsLoading(true)
    }
  }
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 8,
        width: '96vw',
        height: '96vh',
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
      }}
    >
      <div className="flex h-full w-full gap-10 overflow-auto rounded-lg bg-white p-16 max1250:gap-4 max1000:w-[96vw] max1000:flex-col max1000:p-10 max850:p-4">
        <div className="flex gap-10 max1250:gap-4 max1000:hidden">
          <div className="scrollBar flex h-[70vh] flex-col gap-2 overflow-auto max1250:w-[6rem]">
            {product.images.map((image, index) => (
              <img
                src={image}
                alt=""
                className={`h-[12rem] w-[8rem] rounded-md object-cover opacity-50 hover:opacity-90 max1250:h-[9rem] max1250:w-[6rem] ${index === activeImage && 'opacity-100'}`}
                style={{
                  border:
                    index === activeImage
                      ? '2px solid #48A9A6'
                      : '2px solid transparent',
                  opacity: index === activeImage ? 1 : '',
                }}
                onClick={() => {
                  setActiveImage(index)
                }}
              />
            ))}
            {newImages
              .map((img) => URL.createObjectURL(img))
              .map((image, index) => {
                return (
                  <img
                    src={image}
                    alt=""
                    className={`h-[12rem] w-[8rem] rounded-md object-cover opacity-50 hover:opacity-90 ${index + product.images.length === activeImage && 'opacity-100'}`}
                    style={{
                      border:
                        index + product.images.length === activeImage
                          ? '2px solid #48A9A6'
                          : '2px solid transparent',
                      opacity:
                        index + product.images.length === activeImage ? 1 : '',
                    }}
                    onClick={() => {
                      setActiveImage(index + product.images.length)
                    }}
                  />
                )
              })}
            <div className="relative h-[12rem] w-[8rem] cursor-pointer">
              <p className="flex h-[12rem] items-center justify-center rounded-md bg-cardBg text-9xl font-thin text-primary">
                +
              </p>
              <input
                type="file"
                multiple={true}
                accept="image/*"
                className="absolute left-0 top-0 h-[12rem] w-[8rem] cursor-pointer opacity-0"
                onChange={(e) => {
                  const files = e.target.files
                  if (files)
                    setNewImages((imgs) => [...imgs, ...Array.from(files)])
                }}
              />
            </div>
          </div>
          <img
            src={
              product.images[activeImage] ||
              newImages.map((img) => URL.createObjectURL(img))[
                activeImage - product.images.length
              ]
            }
            alt=""
            className="h-[70vh] max-h-[45rem] w-[70vw] max-w-[30rem] rounded-xl object-cover max1250:max-h-[30rem] max1250:w-[50vw] max1250:max-w-[20rem]"
          />
        </div>
        <div className="flex gap-10 max1250:gap-4 min1000:hidden">
          {(product.images.length >= 1 || newImages.length >= 1) && (
            <div className="scrollBar flex gap-2 overflow-auto">
              {product.images.map((image, index) => (
                <img
                  src={image}
                  alt=""
                  className="h-[30rem] max-h-[45rem] w-[70vw] max-w-[40rem] rounded-xl object-cover"
                />
              ))}
              {newImages
                .map((img) => URL.createObjectURL(img))
                .map((image, index) => (
                  <img
                    src={image}
                    alt=""
                    className="h-[30rem] max-h-[45rem] w-[70vw] max-w-[40rem] rounded-xl object-cover"
                  />
                ))}
              <div className="relative h-[30rem] w-[70vw] max-w-[40rem] cursor-pointer rounded-xl">
                <p className="flex h-[30rem] w-[70vw] max-w-[40rem] items-center justify-center rounded-md bg-cardBg text-9xl font-thin text-primary">
                  +
                </p>
                <input
                  type="file"
                  multiple={true}
                  accept="image/*"
                  className="absolute left-0 top-0 h-[30rem] w-[70vw] max-w-[40rem] cursor-pointer opacity-0"
                  onChange={(e) => {
                    const files = e.target.files
                    if (files)
                      setNewImages((imgs) => [...imgs, ...Array.from(files)])
                  }}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          <input
            className="w-full border-0 text-2xl font-medium outline-none"
            value={product.name}
            placeholder="Product Name"
            onChange={(e) => {
              setProduct({ ...product, name: e.target.value })
            }}
          />
          <span></span>
          <div className="border-b-[0.02rem] pb-1 pt-2">
            <span className="px-2 text-2xl font-semibold text-primary">
              ₹{product.discountedPrice}
            </span>
            <span className="px-2 text-sm font-medium text-gray-500 line-through">
              MRP₹
              <input
                className="w-16 px-1 text-sm font-medium text-gray-500 line-through outline-none"
                value={product.price}
                onChange={(e) => {
                  if (parseInt(e.target.value) > 0)
                    setProduct({
                      ...product,
                      price: parseInt(e.target.value),
                      discountedPrice: Math.round(
                        parseInt(e.target.value) -
                          (parseInt(e.target.value) * product.discount) / 100,
                      ),
                    })
                }}
              />
            </span>
            <span className="text-red px-2 text-sm font-medium">
              <input
                className="w-7 px-1 text-sm font-medium text-gray-500 line-through outline-none"
                value={product.discount}
                onChange={(e) => {
                  if (
                    parseInt(e.target.value) >= 0 &&
                    parseInt(e.target.value) < 100
                  )
                    setProduct({
                      ...product,
                      discount: parseInt(e.target.value),
                      discountedPrice: Math.round(
                        product.price -
                          (product.price * parseInt(e.target.value)) / 100,
                      ),
                    })
                }}
              />
              % OFF
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-2">
            <p className="font-bold">QUANTITY:</p>
            <div className="flex ">
              <p
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                onClick={() => {
                  setProduct((p) => {
                    return { ...product, quantity: p.quantity - 1 }
                  })
                }}
                style={{
                  userSelect: 'none',
                }}
              >
                -
              </p>
              <input
                type="number"
                value={product.quantity}
                className="flex h-10 max-w-20 items-center justify-center border-[0.02rem] px-6 focus:outline-none"
                onChange={(e) => {
                  setProduct({ ...product, quantity: parseInt(e.target.value) })
                }}
              />
              <p
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                onClick={() => {
                  setProduct((p) => {
                    return { ...product, quantity: p.quantity + 1 }
                  })
                }}
                style={{
                  userSelect: 'none',
                }}
              >
                +
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <p className="font-bold">DESCRIPTION</p>
            <textarea
              className="h-32 w-full resize-none rounded-md border-0 bg-cardBg p-4 focus:outline-none"
              value={product.description}
              placeholder="Description"
              onChange={(e) => {
                setProduct({ ...product, description: e.target.value })
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            {/* <div className="flex items-center gap-2">
              <p className="w-32 font-bold">PRODUCT TYPE</p>
              <select className="h-8 w-32 rounded px-2">
                <option value="cotton-saree">Cotton Saree</option>
                <option value="silk-saree">Silk Saree</option>
              </select>
            </div>{' '} */}
            <div className="flex items-center gap-2">
              <p className="w-32 font-bold">Celebrity</p>
              <input
                type="checkbox"
                id={'celebrity'}
                name={'Celebrity'}
                value={product.isCelebrity ? 'true' : 'false'}
                checked={product.isCelebrity}
                onChange={() => {
                  setProduct({ ...product, isCelebrity: !product.isCelebrity })
                }}
                className={`${product.isCelebrity ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
              />
            </div>{' '}
            <div className="flex items-center gap-2">
              <p className="w-32 font-bold">FABRIC</p>
              <select
                className="h-8 w-32 rounded px-2"
                value={product.fabric.toLowerCase()}
                onChange={(e) => {
                  setProduct({ ...product, fabric: e.target.value })
                }}
              >
                {fabricOptions.map((fabric, index) => (
                  <option key={fabric + index.toString()} value={fabric.value}>
                    {fabric.content}
                  </option>
                ))}
              </select>
            </div>{' '}
            <div className="flex items-center gap-2">
              <p className="w-32 font-bold">COLOR</p>
              <select
                className="h-8 w-32 rounded px-2"
                value={product.color.toLowerCase()}
                onChange={(e) => {
                  setProduct((p) => {
                    const newColors = p.colors.filter(
                      (color) => color !== p.color,
                    )

                    newColors.push(e.target.value)
                    return {
                      ...product,
                      color: e.target.value,
                      colors: [...newColors],
                    }
                  })
                }}
              >
                {colorOptions.map((color, index) => (
                  <option key={color + index.toString()} value={color.name}>
                    {color.content}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="w-32 font-bold">COLLECTION</p>
              <ul className="flex w-[40vw] flex-wrap gap-x-3 text-gray-500">
                {sareeCollectionsArray.map((collection) => {
                  return (
                    <li key={collection.id} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        id={collection.id}
                        name={collection.name}
                        value={collection.value}
                        checked={product.collections.includes(collection.value)}
                        onChange={handleCheckboxChange}
                        className={`${product.collections.includes(collection.value) ? 'checked:bg-green-500' : 'unchecked:bg-red-500'}`}
                      />
                      <label htmlFor={collection.id}>
                        {collection.label.toUpperCase()}
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          {isLoading ? (
            <div className="flex h-8 w-20 items-center justify-center self-end">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex gap-2">
              <LightPrimaryButton
                content="Cancel"
                func={() => {
                  setAddOpen(false)
                }}
                className="mt-10 flex h-8 w-20 items-center justify-center self-end"
              />
              <PrimaryButton
                content="Create"
                func={createProduct}
                className="mt-10 flex h-8 w-20 items-center justify-center self-end"
              />
            </div>
          )}
        </div>
      </div>
    </Box>
  )
}

export default ProductEditModal
