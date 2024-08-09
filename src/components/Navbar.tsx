'use client'
import Link from 'next/link'
import { GoSearch } from 'react-icons/go'
import { IoPersonOutline } from 'react-icons/io5'
import { IoBagHandleOutline } from 'react-icons/io5'
import NavItems from './NavItems'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'
import SmallCollectionsHover from './Navbar/small/SmallCollectionsHover'
import SmallSaressHover from './Navbar/small/SmallSareesHover'
import SmallWeddingWivesHover from './Navbar/small/SmallWeddingWivesHover'
import SmallCategoriesHover from './Navbar/small/SmallCategoriesHover'

const Navbar = () => {
  const [q, setQ] = useState<string>('')
  const [scrolling, setScrolling] = useState<boolean>(false)
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true)
      } else {
        setScrolling(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const onSearch = async (e: any) => {
    e.preventDefault()
    try {
      router.push(`/search?q=${q}`)
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <>
      <div
        className={`sticky top-0 z-40 flex w-screen justify-center border-b-2 bg-white px-8 text-primary transition-all max1450:hidden ${
          scrolling
            ? 'h-12 items-center py-0 shadow-lg'
            : 'h-[9.75rem] py-0 max1450:h-12'
        }`}
      >
        <div className=" flex w-[90vw] max-w-[100rem] justify-between">
          <div className={`mt-3 flex w-20 gap-3`}>
            <GoSearch size={'1.5rem'} />
            <form className="w-12 pl-2">
              <input
                type="text"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value)
                }}
                placeholder="Search"
                className="px-2 text-primary placeholder:text-primary focus:outline-none"
              />
              <button
                type="submit"
                onClick={(e) => {
                  onSearch(e)
                }}
              >
                {' '}
              </button>
            </form>
          </div>
          <div
            className={`flex flex-col items-center gap-4 ${scrolling ? '' : 'pt-5'}`}
          >
            <h1
              className={`mb-6 cursor-pointer text-5xl ${scrolling ? 'hidden' : ''}`}
              onClick={() => {
                router.push('/')
              }}
            >
              <img className="" alt="Pushkara Sathvaas" />
            </h1>
            <NavItems />
          </div>
          <div className={`mt-3 flex w-20 gap-3`}>
            <Link href="/login">
              <IoPersonOutline size={'1.5rem'} />
            </Link>
            <Link href={'/cart'}>
              <IoBagHandleOutline size={'1.5rem'} />
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`sticky top-0 z-50 mt-3 flex w-screen items-center justify-between bg-white px-4 text-primary min1450:hidden ${
          scrolling ? 'h-12 py-0 shadow-lg' : 'h-[9.75rem] py-0 max1450:h-12'
        }`}
      >
        <CiMenuBurger
          size={'2rem'}
          className="scale-y-[0.75] cursor-pointer"
          onClick={() => {
            setIsNavOpen(true)
          }}
        />
        <div
          className={`absolute top-0 h-screen bg-white shadow-2xl ${isNavOpen ? 'left-0 w-[90vw] min-w-[10rem]' : '-left-[90vw] w-0 min-w-0'}`}
        >
          <ul className="relative pl-4 pt-10">
            <li
              className="flex w-[96%] cursor-pointer flex-col gap-2 border-b-[0.02rem] py-2 text-lg"
              onClick={() => {
                router.push('/collections/new-arrivals')
              }}
            >
              NEW ARRIVALS
            </li>
            <SmallCollectionsHover />
            <SmallSaressHover />
            <li
              className="flex w-[96%] cursor-pointer flex-col gap-2 border-b-[0.02rem] py-2 text-lg"
              onClick={() => {
                router.push('/collections/lehengas')
              }}
            >
              LEHENGAS
            </li>
            <SmallCategoriesHover />
            <li
              className="flex w-[96%] cursor-pointer flex-col gap-2 border-b-[0.02rem] py-2 text-lg"
              onClick={() => {
                router.push('/collections/ready-to-ship')
              }}
            >
              READY TO SHIP
            </li>
            <SmallWeddingWivesHover />
            <IoMdClose
              size={'2rem'}
              className="absolute right-0 top-0 m-2 cursor-pointer"
              onClick={() => {
                setIsNavOpen(false)
              }}
            />
          </ul>
        </div>
        <h1
          className={`cursor-pointer text-3xl max850:text-lg`}
          onClick={() => {
            router.push('/')
          }}
        >
          <img className="" alt="Pushkara Sathvaas" />
          {/* Pushkara Sathvaas */}
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/search">
            <GoSearch size={'1.5rem'} />
          </Link>
          <Link href="/login">
            <IoPersonOutline size={'1.5rem'} />
          </Link>
          <Link href={'/cart'}>
            <IoBagHandleOutline size={'1.5rem'} />
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
