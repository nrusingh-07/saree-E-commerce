import { Review } from '@/types/product'
import { Box, CircularProgress } from '@mui/material'
import axios from 'axios'
import { User } from 'firebase/auth'
import React, { useState } from 'react'
import LightPrimaryButton from '../Buttons/LightPrimaryButton'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/config/Firebase'
import { IoClose } from 'react-icons/io5'
import { useUserAuth } from '@/context/AuthContext'

type ReviewModalProps = {
  productId: string
  setIsReview: React.Dispatch<React.SetStateAction<boolean>>
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  productId,
  setIsReview,
}) => {
  const [review, setReview] = useState<Review>({
    _id: '',
    rating: 0,
    reviewText: '',
    reviewer: '',
    images: [],
    createdDate: '',
  })
  const [images, setImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [index, setIndex] = useState(0)
  const { user } = useUserAuth()

  const createReview = async () => {
    try {
      const imgs = await handleUploadImages(productId)
      const token = await user?.getIdToken()
      await axios.post(
        '/api/user/review',
        {
          productId: productId,
          rating: review?.rating,
          reviewText: review?.reviewText,
          images: imgs,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
    } catch (e) {
      console.log(e)
    } finally {
      setIsReview(false)
      setReview({
        _id: '',
        rating: 0,
        reviewText: '',
        reviewer: '',
        images: [],
        createdDate: '',
      })
    }
  }

  const handleUploadImages = async (id: string) => {
    try {
      setIsLoading(true)

      const uploadPromises = []

      for (const file of images) {
        const storageRef = ref(
          storage,
          `reviews/${id}/${Math.random() * 100000000}${Date.now()}${file.name}`,
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
      return []
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
        borderRadius: 2,
        width: '96vw',
        height: '96vh',
        maxWidth: '40rem',
        maxHeight: '30rem',
        border: 0,
      }}
    >
      <div className="relative h-full w-full p-3">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            {index === 0 && (
              <div className="flex h-full w-full flex-col items-center justify-center">
                <div className="flex items-center justify-center">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div
                      key={value}
                      className={` cursor-pointer text-6xl ${
                        value <= (review.rating || hoveredRating)
                          ? 'text-primary'
                          : 'text-gray-300'
                      }`}
                      onMouseEnter={() => setHoveredRating(value)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => {
                        setReview({ ...review, rating: value })
                        setTimeout(() => {
                          setIndex(1)
                        }, 500)
                      }}
                    >
                      &#9733;
                    </div>
                  ))}
                </div>
              </div>
            )}
            {index === 1 && (
              <div className="flex flex-col items-center justify-center">
                <textarea
                  className="mt-2 h-32  w-full resize-none rounded-md border-0 p-2 focus:border-primary focus:outline-none focus:ring-0"
                  placeholder="Write a review"
                  value={review.reviewText}
                  onChange={(e) => {
                    setReview({ ...review, reviewText: e.target.value })
                  }}
                />
              </div>
            )}
            {index === 2 && (
              <div className="flex h-full flex-col items-center justify-center">
                <div className={`flex h-20 w-[80%] gap-1 border-[0.02rem]`}>
                  {images &&
                    images.map((image, index) => (
                      <div
                        className="relative"
                        key={image.name + index.toString()}
                      >
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt="review"
                          className="h-20 w-20 rounded-md object-cover"
                        />
                        <span
                          className="absolute -right-[0.4rem] -top-[1rem] cursor-pointer text-2xl"
                          onClick={() => {
                            setImages(images.filter((img) => img !== image))
                          }}
                        >
                          &times;
                        </span>
                      </div>
                    ))}
                  <div
                    className={`relative flex h-20 w-20 items-center justify-center bg-cardBg ${images.length > 0 ? 'text-3xl' : 'w-full text-lg'}`}
                  >
                    {images.length > 0 ? '+' : 'Add Images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className={`absolute left-0 top-0 mt-2 h-20 cursor-pointer rounded-md border-0 p-2 opacity-0 focus:border-primary focus:outline-none focus:ring-0 ${images.length > 0 ? 'w-20' : 'w-full'}`}
                      onChange={(e) => {
                        const files = e.target.files
                        if (files) {
                          setImages(Array.from(files))
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {review.rating ? (
              <span>
                <LightPrimaryButton
                  content={index === 2 ? 'Submit' : 'Next'}
                  func={() => {
                    if (index === 0) {
                      setIndex(1)
                    } else if (index === 1) {
                      setIndex(2)
                    } else if (index === 2) {
                      createReview()
                    }
                  }}
                  className="absolute bottom-2 right-2 px-7"
                />
              </span>
            ) : (
              <></>
            )}
            {index > 0 ? (
              <span>
                <LightPrimaryButton
                  content="Back"
                  func={() => {
                    if (index === 1) {
                      setIndex(0)
                    } else if (index === 2) {
                      setIndex(1)
                    }
                  }}
                  className="absolute bottom-2 left-2 px-7"
                />
              </span>
            ) : (
              <></>
            )}
          </>
        )}
        <IoClose
          className="absolute right-3 top-3 cursor-pointer text-3xl"
          onClick={() => {
            setIsReview(false)
          }}
        />
      </div>
    </Box>
  )
}

export default ReviewModal
