import DbConnect from '@/config/DbConfig'
import Impression from '@/models/Impression'
import Order from '@/models/Order'
import User from '@/models/User'

export const usersPerMonthFn = async () => {
  try {
    await DbConnect()

    const currentDate = new Date()

    const userPerMonth = await User.aggregate([
      {
        $match: {
          $or: [
            {
              createdDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
              },
            },
            {
              createdDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdDate' },
            month: { $month: '$createdDate' },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ])
    console.log(userPerMonth)
    const previousMonthUsers = userPerMonth[0] ? userPerMonth[0].totalUsers : 0
    const currentMonthUsers = userPerMonth[1] ? userPerMonth[1].totalUsers : 0

    const usersPerMonth = {
      previousMonth: previousMonthUsers,
      currentMonth: currentMonthUsers,
    }

    return usersPerMonth
  } catch (e) {
    console.log(e)
    return {
      previousMonth: 0,
      currentMonth: 0,
    }
  }
}

export const impressionsPerMonthFn = async () => {
  try {
    const currentDate = new Date()

    const impressionPerMonth = await Impression.aggregate([
      {
        $match: {
          $or: [
            {
              date: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
              },
            },
            {
              date: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          totalImpressions: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ])

    const previousMonthImpressions =
      impressionPerMonth[0]?.totalImpressions || 0
    const currentMonthImpressions = impressionPerMonth[1]?.totalImpressions || 0

    const impressionsPerMonth = {
      previousMonth: previousMonthImpressions,
      currentMonth: currentMonthImpressions,
    }

    return impressionsPerMonth
  } catch (e) {
    console.log(e)
    return {
      previousMonth: 0,
      currentMonth: 0,
    }
  }
}

export const salesAmountPerMonthFn = async () => {
  try {
    const currentDate = new Date()

    const salesAmountPerMonth = await Order.aggregate([
      {
        $match: {
          $or: [
            {
              orderDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
              },
            },
            {
              orderDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              },
            },
          ],
          paymentStatus: 'Success',
          deliveryStatus: 'Delivered',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          totalSalesAmount: { $sum: '$totalPrice' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ])

    const previousMonthSalesAmount =
      salesAmountPerMonth[0]?.totalSalesAmount || 0
    const currentMonthSalesAmount =
      salesAmountPerMonth[1]?.totalSalesAmount || 0

    const saleAmountPerMonth = {
      previousMonth: previousMonthSalesAmount,
      currentMonth: currentMonthSalesAmount,
    }

    return saleAmountPerMonth
  } catch (e) {
    console.log(e)
    return {
      previousMonth: 0,
      currentMonth: 0,
    }
  }
}

export const salesQuantityPerMonthFn = async () => {
  try {
    const currentDate = new Date()

    const salesQuantityPerMonth = await Order.aggregate([
      {
        $match: {
          $or: [
            {
              orderDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() - 1,
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
              },
            },
            {
              orderDate: {
                $gte: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  1,
                ),
                $lt: new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth() + 1,
                  1,
                ),
              },
            },
          ],
          paymentStatus: 'Success',
          deliveryStatus: 'Delivered',
        },
      },
      {
        $unwind: '$products',
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          totalSalesQuantity: { $sum: '$products.quantity' },
        },
      },
    ])

    const previousMonthSalesQuantity =
      salesQuantityPerMonth[0]?.totalSalesQuantity || 0
    const currentMonthSalesQuantity =
      salesQuantityPerMonth[1]?.totalSalesQuantity || 0

    const saleQuantityPerMonth = {
      previousMonth: previousMonthSalesQuantity,
      currentMonth: currentMonthSalesQuantity,
    }

    return saleQuantityPerMonth
  } catch (e) {
    console.log(e)
    return {
      previousMonth: 0,
      currentMonth: 0,
    }
  }
}

export const salesAmountGraphFn = async () => {
  try {
    const currentDate = new Date()

    const salesAmountGraph = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(currentDate.getFullYear() - 1, 0, 1),
            $lt: new Date(currentDate.getFullYear(), 12, 1),
          },
          paymentStatus: 'Success',
          deliveryStatus: 'Delivered',
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          totalSalesAmount: { $sum: '$totalPrice' },
        },
      },
    ])

    const thisYear = currentDate.getFullYear()

    const salesAmountGraphData = Array.from({ length: 12 }).flatMap(
      (_, monthIndex) => [
        {
          prev: {
            year: thisYear - 1,
            month: monthIndex + 1,
            totalSalesAmount: 0,
          },
          current: {
            year: thisYear,
            month: monthIndex + 1,
            totalSalesAmount: 0,
          },
        },
      ],
    )
    salesAmountGraph.forEach((item) => {
      if (item._id.year === thisYear) {
        const index2 = salesAmountGraphData.findIndex((data) => {
          return (
            data.current.year === item._id.year &&
            data.current.month === item._id.month
          )
        })
        if (index2 !== -1) {
          salesAmountGraphData[index2].current.totalSalesAmount =
            item.totalSalesAmount
        }
      } else {
        const index = salesAmountGraphData.findIndex((data) => {
          return (
            data.prev.year === item._id.year &&
            data.prev.month === item._id.month
          )
        })
        if (index !== -1) {
          salesAmountGraphData[index].prev.totalSalesAmount =
            item.totalSalesAmount
        }
      }
    })

    return salesAmountGraphData
  } catch (e) {
    console.log(e)
    return []
  }
}

export const salesQuantityGraphFn = async () => {
  try {
    const currentDate = new Date()

    const salesQuantityGraph = await Order.aggregate([
      {
        $match: {
          orderDate: {
            $gte: new Date(currentDate.getFullYear() - 1, 0, 1),
            $lt: new Date(currentDate.getFullYear(), 12, 1),
          },
          paymentStatus: 'Success',
          deliveryStatus: 'Delivered',
        },
      },
      {
        $unwind: '$products', // Deconstructs the products array
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' },
          },
          totalSalesQuantity: { $sum: '$products.quantity' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ])

    const thisYear = currentDate.getFullYear()

    const salesQuantityGraphData = Array.from({ length: 12 }).flatMap(
      (_, monthIndex) => [
        {
          prev: {
            year: thisYear - 1,
            month: monthIndex + 1,
            totalSalesQuantity: 0,
          },
          current: {
            year: thisYear,
            month: monthIndex + 1,
            totalSalesQuantity: 0,
          },
        },
      ],
    )

    salesQuantityGraph.forEach((item) => {
      if (item._id.year === thisYear) {
        const index2 = salesQuantityGraphData.findIndex((data) => {
          return (
            data.current.year === item._id.year &&
            data.current.month === item._id.month
          )
        })
        if (index2 !== -1) {
          salesQuantityGraphData[index2].current.totalSalesQuantity =
            item.totalSalesQuantity
        }
      } else {
        const index = salesQuantityGraphData.findIndex((data) => {
          return (
            data.prev.year === item._id.year &&
            data.prev.month === item._id.month
          )
        })
        if (index !== -1) {
          salesQuantityGraphData[index].prev.totalSalesQuantity =
            item.totalSalesQuantity
        }
      }
    })

    return salesQuantityGraphData
  } catch (e) {
    console.log(e)
    return []
  }
}
