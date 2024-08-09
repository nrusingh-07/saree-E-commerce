'use client'
import Footer from '@/components/Footer'
import CelebrityList from '@/components/Home/CelebrityList'
import ImageSlider from '@/components/Home/ImageSlider'
import Navbar from '@/components/Navbar'
import { auth } from '@/config/Firebase'
import { ProductType } from '@/types/user'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Page = () => {
  const [celebProducts, setCelebProducts] = useState<ProductType[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const token = await auth.currentUser?.getIdToken()
        const res = await axios.get('/api/user/collections/celeb-sarees', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })

        setCelebProducts(res.data.products)
      } catch (e) {
        console.log(e)
      }
    }

    load()
  }, [])

  return (
    <div className="flex flex-col items-center">
      <Navbar />
      <div className="flex w-[90vw] max-w-[80rem] flex-col items-center gap-10 py-10">
        <ImageSlider />
        <CelebrityList products={celebProducts} />
      </div>
      <Footer />
    </div>
  )
}

export default Page
