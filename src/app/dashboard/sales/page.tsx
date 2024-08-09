'use client'
import DashboardHeader from '@/components/Dashboard/DashboardHeader'
import { useUserAuth } from '@/context/AuthContext'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import 'chart.js/auto'
import { Bar } from 'react-chartjs-2'
import { useUtilContext } from '@/context/UtilContext'
import { FaCaretUp } from 'react-icons/fa6'
import { FaCaretDown } from 'react-icons/fa6'

interface SalesData {
  prev: {
    year: number
    month: number
    totalSalesAmount: number
  }
  current: {
    year: number
    month: number
    totalSalesAmount: number
  }
}

interface SalesQuantityData {
  prev: {
    year: number
    month: number
    totalSalesQuantity: number
  }
  current: {
    year: number
    month: number
    totalSalesQuantity: number
  }
}

interface GraphData {
  usersPerMonth: {
    previousMonth: number
    currentMonth: number
  }
  impressionPerMonth: {
    previousMonth: number
    currentMonth: number
  }
  salesAmountPerMonth: {
    previousMonth: number
    currentMonth: number
  }
  salesQuantityPerMonth: {
    previousMonth: number
    currentMonth: number
  }
  salesAmountGraph: SalesData[]
  salesQuantityGraph: SalesQuantityData[]
}

const initialData: GraphData = {
  usersPerMonth: { previousMonth: 0, currentMonth: 0 },
  impressionPerMonth: { previousMonth: 0, currentMonth: 0 },
  salesAmountPerMonth: { previousMonth: 0, currentMonth: 0 },
  salesQuantityPerMonth: { previousMonth: 0, currentMonth: 0 },
  salesAmountGraph: [],
  salesQuantityGraph: [],
}

const Page = () => {
  const [data, setData] = useState<GraphData>(initialData)
  const { setLoader } = useUtilContext()
  const { userData, user } = useUserAuth()

  useEffect(() => {
    const onLoad = async () => {
      setLoader(true)
      try {
        const token = await user?.getIdToken()
        const data = await axios.get('/api/admin/sales', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setData(data.data)
        console.log(data.data)
      } catch (e) {
        console.log(e)
      } finally {
        setLoader(false)
      }
    }
    if (user && userData?.isAdmin) {
      onLoad()
    }
  }, [user])

  const salesLabels = data.salesAmountGraph.map(
    (entry) => `${entry.current.month}`,
  )
  const salesAmountsCurent = data.salesAmountGraph.map(
    (entry) => entry.current.totalSalesAmount,
  )
  const salesAmountsPrev = data.salesAmountGraph.map(
    (entry) => entry.prev.totalSalesAmount,
  )
  const salesQuantityCurrent = data.salesQuantityGraph.map(
    (entry) => entry.current.totalSalesQuantity,
  )
  const salesQuantityPrev = data.salesQuantityGraph.map(
    (entry) => entry.prev.totalSalesQuantity,
  )
  const thisYear = new Date().getFullYear()

  return (
    <div className="flex flex-col">
      <DashboardHeader active={usePathname().split('/dashboard/')[1]} />
      <div className="mx-10 mb-10 mt-10 flex max-w-[120rem] justify-center gap-10 max1450:mx-5 max1450:flex-col max700:mx-2">
        <div className="flex w-[60%] flex-col max1450:w-[100%]">
          <div className="flex flex-col items-center gap-2">
            <p className="self-start text-2xl">Sales (in Number) / Month</p>
            <div className="w-[100%]">
              <Bar
                data={{
                  labels: salesLabels,
                  datasets: [
                    {
                      label: (thisYear - 1).toString(),
                      data: salesQuantityPrev,
                      backgroundColor: '#77E3E3',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: thisYear.toString(),
                      data: salesQuantityCurrent,
                      backgroundColor: '#48A9A6',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                }}
                className="max-h-[24rem] w-[98%]"
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="self-start text-2xl">Sales (in Amount) / Month</p>
            <div className="w-[100%]">
              <Bar
                data={{
                  labels: salesLabels,
                  datasets: [
                    {
                      label: (thisYear - 1).toString(),
                      data: salesAmountsPrev,
                      backgroundColor: '#77E3E3',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: thisYear.toString(),
                      data: salesAmountsCurent,
                      backgroundColor: '#48A9A6',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                className="max-h-[24rem] w-[98%]"
              />
            </div>
          </div>
        </div>
        <div className="w-[35%] overflow-hidden rounded-md max1450:w-[100%]">
          <p className="p-2 text-3xl">Stats</p>
          <ul className="flex flex-col max1450:w-[100%]">
            <li className="flex h-44 items-end justify-between bg-primary px-5 pb-6 text-white max700:h-24">
              <div className="flex items-end gap-3">
                <p className="text-6xl max700:text-4xl">
                  {data.usersPerMonth.currentMonth}
                </p>
                <p className="pb-1 text-xl max700:text-base">Users</p>
              </div>
              <div className="flex gap-2 pb-4 text-xl max700:pb-1 max700:text-sm">
                {data.usersPerMonth.currentMonth -
                  data.usersPerMonth.previousMonth >
                0 ? (
                  <FaCaretUp className="mt-1 text-green-500" />
                ) : (
                  <FaCaretDown className="mt-1 text-red-500" />
                )}
                <p
                  className={`${data.usersPerMonth.currentMonth - data.usersPerMonth.previousMonth > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
                >
                  {data.usersPerMonth.currentMonth -
                    data.usersPerMonth.previousMonth}
                </p>
                <p>vs last month</p>
              </div>
            </li>
            <li className="flex h-44 items-end justify-between bg-white px-5 pb-6 text-primary max700:h-24">
              <div className="flex items-end gap-3">
                <p className="text-6xl max700:text-4xl">
                  ₹{data.salesAmountPerMonth.currentMonth / 1000}k
                </p>
                <p className="pb-1 text-xl max700:text-base">Sales</p>
              </div>
              <div className="flex gap-2 pb-4 text-xl max700:pb-1 max700:text-sm">
                {data.salesAmountPerMonth.currentMonth -
                  data.salesAmountPerMonth.previousMonth >
                0 ? (
                  <FaCaretUp className="mt-1 text-green-500" />
                ) : (
                  <FaCaretDown className="mt-1 text-red-500" />
                )}
                <p
                  className={`${data.salesAmountPerMonth.currentMonth - data.salesAmountPerMonth.previousMonth > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
                >
                  {(data.salesAmountPerMonth.currentMonth -
                    data.salesAmountPerMonth.previousMonth) /
                    1000}
                  k
                </p>
                <p>vs last month</p>
              </div>
            </li>
            <li className="flex h-44 items-end justify-between bg-primary px-5 pb-6 text-white max700:h-24">
              <div className="flex items-end gap-3">
                <p className="text-6xl max700:text-4xl">
                  {data.salesQuantityPerMonth.currentMonth}
                </p>
                <p className="pb-1 text-xl max700:text-base">Sales</p>
              </div>
              <div className="flex gap-2 pb-4 text-xl max700:pb-1 max700:text-sm">
                {data.salesQuantityPerMonth.currentMonth -
                  data.salesQuantityPerMonth.previousMonth >
                0 ? (
                  <FaCaretUp className="mt-1 text-green-500" />
                ) : (
                  <FaCaretDown className="mt-1 text-red-500" />
                )}
                <p
                  className={`${data.salesQuantityPerMonth.currentMonth - data.salesQuantityPerMonth.previousMonth > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
                >
                  {data.salesQuantityPerMonth.currentMonth -
                    data.salesQuantityPerMonth.previousMonth}
                </p>
                <p>vs last month</p>
              </div>
            </li>
            <li className="flex h-44 items-end justify-between bg-white px-5 pb-6 text-primary max700:h-24">
              <div className="flex items-end gap-3">
                <p className="text-6xl max700:text-4xl">
                  {(data.impressionPerMonth.currentMonth / 1000).toFixed(2)}k
                </p>
                <p className="pb-1 text-xl max700:text-base">Impressions</p>
              </div>
              <div className="flex gap-2 pb-4 text-xl max700:pb-1 max700:text-sm">
                {data.impressionPerMonth.currentMonth -
                  data.impressionPerMonth.previousMonth >
                0 ? (
                  <FaCaretUp className="mt-1 text-green-500" />
                ) : (
                  <FaCaretDown className="mt-1 text-red-500" />
                )}
                <p
                  className={`${data.impressionPerMonth.currentMonth - data.impressionPerMonth.previousMonth > 0 ? 'text-green-500' : 'text-red-500'} font-semibold`}
                >
                  {(
                    (data.impressionPerMonth.currentMonth -
                      data.impressionPerMonth.previousMonth) /
                    1000
                  ).toFixed(3)}
                  k
                </p>
                <p>vs last month</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Page
