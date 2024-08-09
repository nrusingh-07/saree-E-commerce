import { useUserAuth } from '@/context/AuthContext'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CiMenuBurger } from 'react-icons/ci'
import { IoMdClose } from 'react-icons/io'

interface DashboardHeaderProps {
  active: string
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ active }) => {
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false)
  const [balance, setBalance] = useState<number>(0)
  const { user } = useUserAuth()

  useEffect(() => {
    const getBalance = async () => {
      try {
        const token = await user?.getIdToken()
        const res = await axios.get('/api/admin/balance', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBalance(parseInt(res.data.balance))
      } catch (e) {
        console.log(e)
      }
    }
    if (user) getBalance()
  }, [user])

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 w-screen items-center justify-between bg-white pr-4 shadow-lg max850:hidden">
        <ul className="ml-10 flex gap-4">
          <Link href={'/dashboard/sales'}>
            <li
              className="flex w-36 items-center justify-center rounded-md px-2 py-2 max500:w-32 max500:text-sm"
              style={{
                backgroundColor: active === 'sales' ? '#48A9A6' : 'transparent',
                color: active === 'sales' ? 'white' : 'black',
              }}
            >
              SALES
            </li>
          </Link>
          <Link href={'/dashboard/update-store'}>
            <li
              className="flex w-36 items-center justify-center rounded-md px-2 py-2 max500:w-32 max500:text-sm"
              style={{
                backgroundColor:
                  active === 'update-store' ? '#48A9A6' : 'transparent',
                color: active === 'update-store' ? 'white' : 'black',
              }}
            >
              UPDATE STORE
            </li>
          </Link>
          <Link href={'/dashboard/orders'}>
            <li
              className="flex w-36 items-center justify-center rounded-md px-2 py-2 max500:w-32 max500:text-sm"
              style={{
                backgroundColor:
                  active === 'orders' ? '#48A9A6' : 'transparent',
                color: active === 'orders' ? 'white' : 'black',
              }}
            >
              ORDERS
            </li>
          </Link>
        </ul>
        <span className="flex items-center gap-2">
          <p>Balance</p>
          <p>{balance}</p>
        </span>
      </div>
      <div
        className={`sticky top-0 z-50 mt-3 flex h-10 w-screen items-center justify-between bg-white px-4 text-primary min850:hidden`}
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
          <ul className="mt-10 flex flex-col gap-4 px-10 max500:px-4">
            <Link href={'/dashboard/sales'}>
              <li
                className="flex items-center justify-center rounded-md py-2 hover:bg-primary hover:text-white max500:text-sm"
                style={{
                  backgroundColor:
                    active === 'sales' ? '#48A9A6' : 'transparent',
                  color: active === 'sales' ? 'white' : 'black',
                }}
              >
                SALES
              </li>
            </Link>
            <Link href={'/dashboard/update-store'}>
              <li
                className="flex items-center justify-center rounded-md py-2 hover:bg-primary hover:text-white max500:text-sm"
                style={{
                  backgroundColor:
                    active === 'update-store' ? '#48A9A6' : 'transparent',
                  color: active === 'update-store' ? 'white' : 'black',
                }}
              >
                UPDATE STORE
              </li>
            </Link>
            <Link href={'/dashboard/orders'}>
              <li
                className="flex items-center justify-center rounded-md py-2 max500:text-sm"
                style={{
                  backgroundColor:
                    active === 'orders' ? '#48A9A6' : 'transparent',
                  color: active === 'orders' ? 'white' : 'black',
                }}
              >
                ORDERS
              </li>
            </Link>
          </ul>
          <IoMdClose
            size={'2rem'}
            className="absolute right-0 top-0 m-2 cursor-pointer"
            onClick={() => {
              setIsNavOpen(false)
            }}
          />
        </div>
        <span className="flex items-center gap-2">
          <p>Balance</p>
          <p>{balance}</p>
        </span>
      </div>
    </>
  )
}

export default DashboardHeader
