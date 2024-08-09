'use client'
import { ProductType } from '@/types/user'
import React, { useEffect, useRef, useState } from 'react'
import PrimaryButton from '../../../components/Buttons/PrimaryButton'
import Navbar from '@/components/Navbar'
import axios from 'axios'
import { useUserAuth } from '@/context/AuthContext'
import { useUtilContext } from '@/context/UtilContext'
import Link from 'next/link'
import LightPrimaryButton from '@/components/Buttons/LightPrimaryButton'
import Footer from '@/components/Footer'
import { useProductContext } from '@/context/ProductContext'
import { useRouter } from 'next/navigation'
import { auth } from '@/config/Firebase'
import { Box, Modal } from '@mui/material'
import ReviewModal from '@/components/Product/ReviewModal'
import { Review } from '@/types/product'
import PaymentModal from '@/components/Order/PaymentModal'

interface pageProps {
  params: {
    productId: string
  }
}

interface ReviewViewerProps {
  reviews: Review[]
}

interface similarProductType {
  _id: string
  images: string[]
  color: string
}

const Page: React.FC<pageProps> = ({ params }) => {
  const [product, setProduct] = useState<ProductType>({
    _id: '',
    availability: true,
    isCelebrity: false,
    brand: '',
    color: '',
    colors: [],
    createdDate: '',
    description: '',
    discount: 0,
    fabric: '',
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
  })
  const [reviews, setReviews] = useState<Review[]>([])
  const [recentProducts, setRecentProducts] = useState<ProductType[]>([])
  const [similarProducts, setSimilarProducts] = useState<similarProductType[]>(
    [],
  )
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedDescription, setSelectedDescription] =
    useState<String>('description')
  const [isSupplierActive, setIsSelectedActive] = useState<boolean>(false)
  const [isReview, setIsReview] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isBuy, setIsBuy] = useState(false)
  const { addToCart } = useProductContext()
  const { user } = useUserAuth()
  const { setLoader } = useUtilContext()
  const router = useRouter()
  const targetRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { root: null, rootMargin: '0px', threshold: 0.5 },
    )

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const getProduct = async () => {
      setLoader(true)
      try {
        const res = await axios.get(`/api/user/product/${params.productId}`)
        setProduct(res.data.product)
        setReviews(res.data.reviews)
        setRecentProducts(res.data.recentProducts)
        setSimilarProducts(res.data.similarProducts)
      } catch (e) {
        console.log(e)
      } finally {
        setLoader(false)
      }
    }
    getProduct()
  }, [])

  const buyNow = async () => {
    if (auth.currentUser) setIsBuy(true)
    else router.push('/login')
  }
  return (
    <div className="flex h-full w-screen flex-col items-center justify-center gap-10 rounded-lg bg-white">
      <Navbar />
      <div className="mb-10 w-[90vw] max-w-[85rem] flex-col items-center max1000:w-[96vw]">
        <div className="flex h-full justify-center gap-10 rounded-lg bg-white max1250:gap-4 max1000:w-[96vw] max1000:flex-col">
          <div className="flex gap-10 max1250:gap-4 max1000:hidden">
            <div className="scrollBar flex h-[70vh] w-[8rem] flex-col gap-2 overflow-auto max1250:w-[6rem]">
              {product.images.map((image, index) => (
                <img
                  key={image + index}
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
            </div>
            <img
              src={product.images[activeImage]}
              alt=""
              className="h-[70vh] max-h-[45rem] w-[70vw] max-w-[30rem] rounded-xl object-cover max1250:max-h-[30rem] max1250:w-[50vw] max1250:max-w-[20rem]"
            />
          </div>
          <div className="flex gap-10 max1250:gap-4 min1000:hidden">
            {product.images.length >= 1 && (
              <div className="scrollBar flex gap-2 overflow-auto">
                {product.images.map((image, index) => (
                  <img
                    src={image}
                    alt=""
                    className="h-[] max-h-[45rem] w-[70vw] max-w-[40rem] rounded-xl object-cover"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-medium">{product.name}</h3>
            <span></span>
            <div className="border-b-[0.02rem] pb-1 pt-2">
              <span className="px-2 text-2xl font-semibold text-primary">
                ₹{product.discountedPrice}
              </span>
              <span className="px-2 text-sm font-medium text-gray-500 line-through">
                MRP₹{product.price}
              </span>
              <span className="text-red px-2 text-sm font-medium">
                {product.discount}% OFF
              </span>
            </div>
            <ul className="flex flex-col p-2">
              <li className="flex items-center gap-1">
                <img src="/productView/authentic.svg" alt="authentic" />
                <p className="font-light">Authentic & Quality Assured</p>
              </li>
              <li className="flex items-center gap-1">
                <img src="/productView/gaurentee.svg" alt="gaurentee" />
                <p className="font-light">100% money back guarantee </p>
                <Link href={'/refund'}>*Learn more</Link>
              </li>
              <li className="flex items-center gap-1">
                <img src="/productView/shipping.png" alt="shipping" />
                <p className="font-light">Free Shipping & Returns</p>
                <Link href={'/refund'}>*Learn more</Link>
              </li>
            </ul>
            {similarProducts.length > 1 && (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  {similarProducts.map((p, index) => {
                    if (index > 3) return <></>
                    return (
                      <div
                        key={p._id + 'similarProduct'}
                        className="flex flex-col items-center gap-2"
                      >
                        <img
                          src={p.images[0]}
                          alt=""
                          onClick={() => {
                            if (product._id !== p._id)
                              router.push(`/product/${p._id}`, undefined)
                          }}
                          className={`h-[5rem] w-[3.5rem] rounded-md object-cover  ${product._id === p._id ? 'opacity-100' : 'opacity-50'} cursor-pointer hover:opacity-100`}
                        />
                        <p className="text-sm font-light">{p.color}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="mt-2 flex flex-col gap-2">
              <p className="font-bold">QUANTITY:</p>
              <div className="flex ">
                <p
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                  onClick={() => {
                    if (quantity > 1) {
                      setQuantity((q) => q - 1)
                    }
                  }}
                >
                  -
                </p>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    if (product.quantity >= parseInt(e.target.value))
                      setQuantity(parseInt(e.target.value))
                    else setQuantity(1)
                  }}
                  className="flex h-10 max-w-10 items-center justify-center border-[0.02rem] pl-2 pr-1 focus:outline-none"
                />
                <p
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-md border-[0.02rem] border-r-0 text-2xl"
                  onClick={() => {
                    setQuantity((q) => q + 1)
                  }}
                >
                  +
                </p>
              </div>
            </div>
            <div className="flex gap-3" ref={targetRef}>
              <LightPrimaryButton
                content="ADD TO CART"
                func={async () => {
                  if (auth.currentUser) addToCart(product._id)
                  else router.push('/login')
                }}
                className="w-48"
              />
              <PrimaryButton content="BUY NOW" func={buyNow} className="w-48" />
            </div>
            {
              <div
                className={`fixed bottom-0 left-0 flex w-screen items-center justify-between bg-white p-2 shadow-md transition-all duration-300 min1000:hidden ${isVisible ? '-bottom-16' : 'bottom-0'}`}
              >
                <span className="flex items-end gap-3">
                  <p className="font-light">₹ {product.discountedPrice}</p>
                  <p className="text-sm text-red-500">
                    {product.discount}% OFF
                  </p>
                </span>
                <div className="flex gap-3">
                  <LightPrimaryButton
                    content="ADD TO CART"
                    func={async () => {
                      if (auth.currentUser) addToCart(product._id)
                      else router.push('/login')
                    }}
                    className="w-48"
                  />
                  <PrimaryButton
                    content="BUY NOW"
                    func={buyNow}
                    className="w-48"
                  />
                </div>
              </div>
            }
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex gap-4">
                <p
                  className={`cursor-pointer pb-2 text-sm font-light hover:text-primary ${selectedDescription === 'description' ? 'border-b-[0.02rem] border-primary text-primary' : ''}`}
                  onClick={() => setSelectedDescription('description')}
                >
                  DESCRIPTION
                </p>
                <p
                  className={`cursor-pointer pb-2 text-sm font-light hover:text-primary ${selectedDescription === 'fabric' ? 'border-b-[0.02rem] border-primary text-primary' : ''}`}
                  onClick={() => setSelectedDescription('fabric')}
                >
                  FABRIC
                </p>
              </div>
              {selectedDescription === 'description' && (
                <textarea
                  className="h-32 w-full resize-none rounded-md border-0 bg-cardBg p-4 focus:outline-none"
                  value={product['description']}
                  readOnly={true}
                />
              )}
              {selectedDescription === 'fabric' && (
                <textarea
                  className="h-32 w-full resize-none rounded-md border-0 bg-cardBg p-4 focus:outline-none"
                  value={product['fabric']}
                  readOnly={true}
                />
              )}
            </div>
            <div className="mt-10 rounded-md bg-secondary p-5 py-8">
              <p className="font-medium">YOUR SAFETY IS OUR PROIRITY</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex w-40 flex-col items-center gap-2">
                  <img
                    src="/productView/easy-return.svg"
                    alt="easy-return"
                    className="h-20 w-20"
                  />
                  <p className="text-sm">Easy Return</p>
                </div>
                <div className="flex w-40 flex-col items-center gap-2">
                  <img
                    src="/productView/no-contact-delivery.svg"
                    alt="contact-delivery"
                    className="h-20 w-20"
                  />
                  <p className="text-sm">No Contact Delivery</p>
                </div>
                <div className="flex w-40 flex-col items-center gap-2">
                  <img
                    src="/productView/safe-packing.svg"
                    alt="Packaging"
                    className="h-20 w-20"
                  />
                  <p className="text-sm">Safe & Clean Packaging</p>
                </div>
              </div>
            </div>
            <div className="flex w-[30vw] flex-col border-y-[0.04rem] py-1 max1000:w-[90vw] ">
              <div
                className="flex items-center justify-between px-2"
                onClick={() => setIsSelectedActive((e) => !e)}
              >
                <p className="font-semibold">SUPPLIER INFORMATION</p>
                <span className="text-lg">{isSupplierActive ? '-' : '+'}</span>
              </div>
              {isSupplierActive && (
                <p className="w-[30vw] max1000:w-[90vw] max1000:px-5">
                  Marketed By: Pyxis Brand Technologies Private Limited,
                  Vaishnavi Silicon Terraces, #30/1, 2nd and 3rd Floor, Adugodi,
                  Hosur Main Road, Bengaluru - 560 095
                </p>
              )}
            </div>
          </div>
        </div>
        {/* <div className="flex w-[85rem] min-w-[98vw] flex-col items-center gap-6">
        <h5 className="text-3xl font-normal">RECENTLY VISITED</h5>
        <div className="flex flex-wrap justify-center gap-7 ">
          {recentProducts.map((product, index) => {
            if (index > 3) return <></>
            return (
              <Card
                product={product}
                key={product._id + 'recentProduct' + 'card' + index}
              />
            )
          })}
        </div>
      </div> */}
        <div className="mt-6 flex flex-col items-start gap-3">
          <div className="flex w-[100%] items-center justify-between">
            <p className="pl-2 "> ({reviews.length}) reviews</p>
            <div>
              <p
                className="cursor-pointer rounded-md border-[0.02rem] px-3 py-2"
                onClick={() => {
                  setIsReview(true)
                }}
              >
                Write a Review
              </p>
            </div>
          </div>
          <div className="flex w-[100%] flex-wrap justify-start gap-3">
            {reviews.slice(0, 10).map((review) => (
              <div
                key={review._id}
                className="flex w-[17rem] flex-col bg-cardBg p-3 max850:w-[10rem]"
              >
                {review.images && review.images.length > 0 && (
                  <div className="aspect-w-16 aspect-h-9 mb-2 max500:text-sm">
                    <img
                      src={review.images[0]}
                      alt={`Review by ${review.reviewer}`}
                      className="w-[17rem] rounded object-cover max850:w-[10rem]"
                    />
                  </div>
                )}
                <div className="">
                  <div className="mb-1 font-bold max500:text-sm">
                    {review.reviewer}
                  </div>
                  <div className="mb-1 text-sm max500:text-xs">
                    {review.createdDate}
                  </div>
                  <div className="mb-1 flex gap-1 max500:text-sm">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <span key={i} className="text-sm text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <div className="line-clamp-2 max-h-16 w-[17rem] max-w-xs overflow-hidden whitespace-normal px-2 text-sm max850:w-[9rem] max500:px-0 max500:text-xs">
                    {review.reviewText}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      {user && (
        <Modal
          open={isReview}
          onClose={() => {
            setIsReview(false)
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ReviewModal productId={product._id} setIsReview={setIsReview} />
        </Modal>
      )}
      {user && (
        <Modal
          open={isBuy}
          onClose={() => {
            setIsBuy(false)
          }}
          aria-labelledby="payment"
          aria-describedby="payment"
        >
          <PaymentModal
            isCart={false}
            productQuan={{
              product: product,
              quantity: quantity,
            }}
            setIsBuy={setIsBuy}
          />
        </Modal>
      )}
    </div>
  )
}

export default Page
